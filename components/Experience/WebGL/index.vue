<template>
	<div class="webgl">
		<canvas
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>

		<div class="flash-effect" aria-hidden="true" ref="flashEffectRef" />
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import {
	reflector,
	vec2,
	Fn,
	pass,
	uniform,
	positionWorld,
	float,
	screenUV,
	mix,
	time,
} from 'three/tsl'
// import { dof } from 'three/addons/tsl/display/DepthOfFieldNode'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

import { ktxLoader, textureLoader } from '~/assets/js/loaders'

import {
	FloorMaterial,
	BackgroundMaterial,
	ParticlesMaterial,
	GodraysMaterial,
	experienceEndDrawMaterial,
	MaskMaterial,
} from './materials'
import {
	getDisplacement,
	noiseTexture as seaNoiseTexture,
} from './materials/floor'

import { noiseTexture as godraysNoiseTexture } from './materials/godrays'
import { noiseTexture as particlesNoiseTexture } from './materials/particles'
import { noiseTexture as drawNoiseTexture } from './materials/draw'
import {
	maskColorA as maskBorderColorA,
	maskColorB as maskBorderColorB,
	borderWidth as maskBorderWidth,
} from './materials/mask'

import { cart2Polar } from './nodes'

//
// Refs / State
//
const { gsap, Observer } = useGSAP()

const el = useCurrentElement()
const canvasRef = useTemplateRef('canvasRef')
const flashEffectRef = useTemplateRef('flashEffectRef')

const { width: componentWidth, height: componentHeight } =
	useElementBounding(el)
const { pixelRatio } = useDevicePixelRatio()
const visible = useElementVisibility(el)
const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')

const { isPortrait, isLandscape } = useViewport()

let scene,
	camera,
	renderer,
	controls,
	postProcessing,
	godrays,
	background,
	particles,
	debugPanel,
	statsPanel,
	pointerObserver,
	pointerIsMoving = false,
	tickSinceLastPointerMove = 0,
	maskScene,
	maskCamera

const cameraRotationOffset = { value: 0 }
const cameraPositionOffset = { x: 0, y: 0 }

const textures = new Map()

const dofParams = Object.freeze({
	focusDistance: uniform(7.4),
	focalLength: uniform(11),
	bokehScale: uniform(8),
})

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()
	createMask()

	await createRenderer()
	await loadTextures()

	createSea()
	createBackground()
	createGodrays()

	createWinDrawingPlane()

	await createParticles()

	createPostprocessing()
	createMouse()

	if (isDebug) createControls()

	gsap.ticker.add(time => {
		if (!get(visible)) return

		updateScene(time)
		// renderer.renderAsync(scene, camera)
		// renderer.renderAsync(maskScene, maskCamera)
		postProcessing.renderAsync()

		renderer.resolveTimestampsAsync(THREE.TimestampQuery.RENDER)

		statsPanel?.update()
		debugPanel?.pane?.refresh()
	})

	if (isDebug) {
		const { Debug } = await import('./Debug')
		debugPanel = new Debug(
			dofParams,
			godrays,
			background,
			particles,
			experienceEndDrawMaterial
		)

		const { default: Stats } = await import('stats-gl')
		statsPanel = new Stats({
			trackGPU: true,
			trackHz: true,
			trackCPT: false,
			logsPerSecond: 4,
			graphsPerSecond: 30,
			samplesLog: 40,
			samplesGraph: 10,
			precision: 2,
			horizontal: false,
			minimal: false,
			mode: 0,
		})

		statsPanel.init(renderer)

		statsPanel.dom.style.position = null
		statsPanel.dom.style.top = null
		statsPanel.dom.style.left = null
		statsPanel.dom.style.zIndex = null

		document.getElementById('stats-wrapper').appendChild(statsPanel.dom)
	}
})

//
// Events
//
emitter.on(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_START, () => {
	gsap.fromTo(
		experienceEndDrawMaterial.progress,
		{
			value: 0,
		},
		{
			value: 1,
			duration: 2.5,
			ease: 'power1.out',
			onComplete: () => {
				emitter.emit(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_COMPLETE)
			},
		}
	)
})

emitter.on(EVENTS.TRIGGER_FLASH_EFFECT, () => {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.to(
		get(flashEffectRef),
		{
			opacity: 0.7,
			duration: 0.1,
			ease: 'power1.out',
		},
		'start'
	)

	tl.call(
		() => {
			maskBorderWidth.value = 0.015
		},
		null,
		'>'
	)
	tl.to(
		get(flashEffectRef),
		{
			opacity: 0,
			duration: 1.5,
			ease: 'power1.out',
		},
		'>'
	)
})

//
// Watchers
//
watch(pixelRatio, value => {
	renderer.setPixelRatio(Math.min(1.2, value))
})

watch([componentWidth, componentHeight], value => {
	camera.aspect = value[0] / value[1]
	camera.updateProjectionMatrix()

	setBackgroundSize()

	renderer.setSize(value[0], value[1])
})

//
// Methods
//
function updateScene(time = 0) {
	controls?.update()

	if (isDebug) return

	// Offset camera on pointer movement
	tickSinceLastPointerMove++
	tickSinceLastPointerMove > 5 && (pointerIsMoving = false)

	if (!pointerIsMoving) {
		cameraRotationOffset.value *= 0.9999

		Math.abs(cameraRotationOffset.value) < 0.0005 &&
			(cameraRotationOffset.value = 0)
	}

	camera.lookAt(0, 0, -5)

	camera.position.x = cameraPositionOffset.x * 0.05
	camera.position.y = cameraPositionOffset.y * 0.05
	camera.rotation.z = cameraRotationOffset.value * 0.15
}

function createScene() {
	scene = new THREE.Scene()
}

function createCamera() {
	camera = new THREE.PerspectiveCamera(
		40,
		get(componentWidth) / get(componentHeight),
		0.1,
		20
	)

	camera.position.set(0, 0.5, 4)
	camera.lookAt(0, 0, -1)
}

async function createRenderer() {
	renderer = new THREE.WebGPURenderer({
		canvas: get(canvasRef),
		alpha: true,
		antialias: true,
	})

	renderer.setClearColor(0x000000, 1)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.setSize(get(componentWidth), get(componentHeight))

	await renderer.init()
}

async function loadTextures() {
	ktxLoader.detectSupport(renderer)

	const ktx = await ktxLoader.load([
		'/webgl/backgrounds/01-mobile.ktx2',
		'/webgl/backgrounds/02-mobile.ktx2',
		'/webgl/backgrounds/03-mobile.ktx2',
		'/webgl/backgrounds/04-mobile.ktx2',
		'/webgl/noises/noise.ktx2',
	])

	ktx[0].colorSpace = THREE.SRGBColorSpace
	ktx[1].colorSpace = THREE.SRGBColorSpace
	ktx[2].colorSpace = THREE.SRGBColorSpace
	ktx[3].colorSpace = THREE.SRGBColorSpace

	ktx[4].colorSpace = THREE.NoColorSpace
	ktx[4].wrapS = ktx[4].wrapT = THREE.RepeatWrapping

	textures.set('bg_01_mobile', ktx[0])
	textures.set('bg_02_mobile', ktx[1])
	textures.set('bg_03_mobile', ktx[2])
	textures.set('bg_04_mobile', ktx[3])

	textures.set('noise', ktx[4])

	seaNoiseTexture.value = textures.get('noise')
	godraysNoiseTexture.value = textures.get('noise')
	particlesNoiseTexture.value = textures.get('noise')
	drawNoiseTexture.value = textures.get('noise')
}

async function createParticles() {
	const map = await textureLoader.load('/webgl/particle.webp')
	map.colorSpace = THREE.SRGBColorSpace

	const count = 9000
	const positions = new Float32Array(count * 3)

	let i
	for (i = 0; i < count; i++) {
		const rnd = Math.random()
		const easedRandom = gsap.parseEase('circ.inOut')(rnd)
		const x = gsap.utils.mapRange(0, 1, -5, 5, easedRandom)
		const y = gsap.utils.random(-1, 3)
		const z = gsap.utils.random(-4, 1)

		positions[i * 3 + 0] = x
		positions[i * 3 + 1] = y
		positions[i * 3 + 2] = z
	}
	const positionsAttribute = new THREE.InstancedBufferAttribute(positions, 3)

	const { material } = new ParticlesMaterial(map, positionsAttribute)

	particles = new THREE.Sprite(material)
	particles.count = count

	scene.add(particles)
}

function createBackground() {
	const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
	const material = new BackgroundMaterial(textures).material
	background = new THREE.Mesh(geometry, material)

	background.position.set(0, -1, -5)

	setBackgroundSize()

	scene.add(background)
}

function createGodrays() {
	const geometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 64, 1, true)

	godrays = new THREE.Mesh(geometry, GodraysMaterial)
	godrays.position.set(0, 1.5, -1.3)

	scene.add(godrays)
}

async function createWinDrawingPlane() {
	const map = await textureLoader.load('/webgl/draw/product-outline.png')
	map.colorSpace = THREE.SRGBColorSpace

	const geometry = new THREE.PlaneGeometry(1.24, 1.74, 1, 1)
	experienceEndDrawMaterial.init(map)
	const mesh = new THREE.Mesh(geometry, experienceEndDrawMaterial.material)

	scene.add(mesh)
}

function createSea() {
	const reflection = reflector({ resolutionScale: 0.5 })
	reflection.target.rotateX(-Math.PI / 2)
	reflection.target.position.y = -1

	const uvDisplacement = Fn(() => {
		return vec2(getDisplacement().x.mul(0.3), getDisplacement().y.mul(0.3))
	})()

	reflection.uvNode = reflection.uvNode.add(uvDisplacement)

	scene.add(reflection.target)

	const getReflectivity = Fn(() => {
		const base = float(0.45)
		const value = positionWorld.x.div(2).abs().clamp(0, 1).oneMinus()

		const x = base.add(value).clamp(0, 1)

		return x
	})

	FloorMaterial.emissiveNode = reflection.mul(getReflectivity()).mul(0.6)

	const geometry = new THREE.PlaneGeometry(20, 10, 250, 150)
	geometry.rotateX(-Math.PI / 2)
	const mesh = new THREE.Mesh(geometry, FloorMaterial)
	mesh.position.y = -1
	scene.add(mesh)
}

function createMouse() {
	pointerObserver = Observer.create({
		type: 'pointer,touch',
		onMove(observer) {
			pointerIsMoving = true
			tickSinceLastPointerMove = 0

			const { y, x, deltaX } = observer

			gsap.to(cameraRotationOffset, {
				value: () => deltaX / get(componentWidth),
				duration: 0.4,
				overwrite: true,
			})

			gsap.to(cameraPositionOffset, {
				x: () => (x / get(componentWidth)) * 2 - 1,
				y: () => -(y / get(componentHeight)) * 2 + 1,
				duration: 1,
				overwrite: true,
			})
		},
	})
}

function createControls() {
	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.enableZoom = true
}

function createMask() {
	maskScene = new THREE.Scene()
	maskCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

	const geometry = new THREE.PlaneGeometry(2, 2)
	const mesh = new THREE.Mesh(geometry, MaskMaterial)

	maskScene.add(mesh)
}

function createPostprocessing() {
	postProcessing = new THREE.PostProcessing(renderer)

	const scenePass = pass(scene, camera)
	const mask = pass(maskScene, maskCamera)

	// const scenePassColor = scenePass.getTextureNode()
	// const scenePassViewZ = scenePass.getViewZNode()

	const uvScreen = vec2(screenUV.x, screenUV.y.oneMinus())
	const polar = cart2Polar(uvScreen.sub(0.5))
	const angle = polar.y.toVar()
	const angleOffset = (Math.PI / 180) * 70

	const borderMix = angle
		.add(time)
		.add(angleOffset)
		.mul(2)
		.sin()
		.mul(0.5)
		.add(0.5)
		.smoothstep(0, 1)
	const borderColor = mix(maskBorderColorA, maskBorderColorB, borderMix)

	const inner = scenePass.mul(mask.r).toVec4()
	const outer = borderColor.mul(mask.g).toVec4()
	const alpha = mask.r.add(mask.g).clamp(0, 1)

	let compose = inner.add(outer).mul(alpha)

	postProcessing.outputNode = compose

	// const dofPass = dof(
	// 	scenePassColor,
	// 	scenePassViewZ,
	// 	dofParams.focusDistance,
	// 	dofParams.focalLength,
	// 	dofParams.bokehScale
	// )

	// postProcessing.outputNode = dofPass
}

function setBackgroundSize() {
	if (!!!background) return

	if (get(isPortrait)) background.scale.set(10.8, 19.2, 1)
	else if (get(isLandscape)) background.scale.set(19.2, 10.8, 1)
}
</script>

<style lang="scss" scoped>
.webgl {
	@apply grid overflow-hidden;
}

.canvas,
.flash-effect {
	@apply w-full h-full col-start-1 row-start-1;
}

.flash-effect {
	@apply pointer-events-none bg-gold-dark opacity-0;
}
</style>
