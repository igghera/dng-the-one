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
	select,
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
	experienceIntroDrawMaterial,
	experienceEndDrawMaterial,
	MaskMaterial,
	IntroBackgroundMaterial,
} from './materials'
import {
	getDisplacement,
	noiseTexture as seaNoiseTexture,
} from './materials/floor'

import { noiseTexture as godraysNoiseTexture } from './materials/godrays'
import { noiseTexture as particlesNoiseTexture } from './materials/particles'
import {
	maskColorA as maskBorderColorA,
	maskColorB as maskBorderColorB,
	borderWidth as maskBorderWidth,
} from './materials/mask'

import { cart2Polar, noiseTexture, bgTexture } from './nodes'

//
// Refs / State
//
const uiStore = useUiStore()

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

const { isPortrait, isLandscape, isMobile, isMedium, isDesktop } = useViewport()

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
	mainCameraIsAnimating = false,
	tickSinceLastPointerMove = 0,
	introScene,
	introMesh,
	introCamera,
	maskScene,
	maskCamera

const mainCameraParams = Object.freeze({
	positionStart: new THREE.Vector3(0, -0.5, 4),
	positionEnd: new THREE.Vector3(0, 0.5, 4),
	lookAt: new THREE.Vector3(0, 0, -5),
})

const introMeshParams = Object.freeze({
	positionStart: new THREE.Vector3(0.5, -0.8, 0),
	positionEnd: new THREE.Vector3(0, -0.8, 0),
})

const cameraRotationOffset = { value: 0 }
const cameraPositionOffset = { x: 0, y: 0 }

const textures = new Map()

const dofParams = Object.freeze({
	focusDistance: uniform(7.4),
	focalLength: uniform(11),
	bokehScale: uniform(8),
})

const introSceneVisibility = uniform(1)

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()

	await createRenderer()
	await loadTextures()

	createIntroScene()
	createMaskScene()

	createSea()
	createBackground()
	createGodrays()

	createWinDrawingPlane()

	await createParticles()

	createPostprocessing()
	createMouse()

	// if (isDebug) createControls()

	emitter.emit(EVENTS.WEBGL_READY)
	uiStore.setWebglVisible(true)

	gsap.ticker.add(time => {
		if (!get(visible)) return

		updateScene(time)
		// renderer.renderAsync(scene, camera)
		// renderer.renderAsync(maskScene, maskCamera)
		// renderer.renderAsync(introScene, introCamera)
		postProcessing.render()

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
			experienceEndDrawMaterial,
			experienceIntroDrawMaterial,
			introSceneVisibility
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
emitter.on(EVENTS.ANIMATE_IN_INTRO, () => {
	animateInIntroShape()
})

emitter.on(EVENTS.ANIMATE_OUT_INTRO_SHAPE, () => {
	animateOutIntroShape()
})

emitter.on(EVENTS.ANIMATE_IN_MAIN_SCENE, () => {
	animateInMainScene()
})

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

	if (introCamera) {
		introCamera.aspect = value[0] / value[1]
		introCamera.updateProjectionMatrix()
	}

	setBackgroundSize()

	renderer.setSize(value[0], value[1])
})

watch(
	() => [get(isMobile), get(isMedium), get(isDesktop)],
	() => {
		setIntroMeshScale()
	}
)

//
// Methods
//
function animateInIntroShape() {
	const tl = gsap.timeline({
		onComplete: () => {
			document.documentElement.dataset.init = true
		},
	})
	tl.addLabel('start')

	tl.fromTo(
		experienceIntroDrawMaterial.progress,
		{
			value: 0,
		},
		{
			value: 1,
			duration: 5,
		},
		'start'
	)

	tl.fromTo(
		introMesh.position,
		{
			x: introMeshParams.positionStart.x,
			y: introMeshParams.positionStart.y,
			z: introMeshParams.positionStart.z,
		},
		{
			x: introMeshParams.positionEnd.x,
			y: introMeshParams.positionEnd.y,
			z: introMeshParams.positionEnd.z,
			duration: 3,
			ease: 'power2.out',
		},
		'start'
	)

	tl.call(
		() => {
			uiStore.setMainUiVisible(true)
		},
		null,
		'<2'
	)

	tl.call(
		() => {
			uiStore.setExperienceStartVisible(true)
		},
		null,
		'<0.5'
	)
}

function animateOutIntroShape() {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.fromTo(
		introMesh.position,
		{ z: 0 },
		{
			z: 2.3,
			ease: 'circ.in',
			duration: 0.5,
		},
		'start'
	)

	tl.fromTo(
		experienceIntroDrawMaterial.opacity,
		{ value: 1 },
		{
			value: 0,
			duration: 0.3,
		},
		'start+=0.15'
	)

	tl.call(
		() => {
			emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)
		},
		null,
		'start+=0.3'
	)

	tl.call(
		() => {
			uiStore.setExperienceEnterNameVisible(true)
			uiStore.setExperienceStartVisible(false)
		},
		null,
		'start+=0.5'
	)
}

function animateInMainScene() {
	const tl = gsap.timeline({
		onStart: () => {
			mainCameraIsAnimating = true
		},
		onComplete: () => {
			mainCameraIsAnimating = false
		},
	})
	tl.addLabel('start')

	tl.fromTo(
		introSceneVisibility,
		{ value: 1 },
		{ value: 0, duration: 0.1 },
		'start'
	)

	tl.addLabel('animateCamera', '>')

	tl.fromTo(
		camera.position,
		{ y: mainCameraParams.positionStart.y },
		{
			y: mainCameraParams.positionEnd.y,
			duration: 3.5,
			ease: 'power2.out',
		},
		'animateCamera'
	)

	tl.call(
		() => {
			uiStore.setExperienceStep01Visible(true)
		},
		null,
		'animateCamera+=2'
	)
}

function updateScene(time = 0) {
	controls?.update()

	camera.lookAt(
		mainCameraParams.lookAt.x,
		mainCameraParams.lookAt.y,
		mainCameraParams.lookAt.z
	)

	// if (isDebug) return
	if (mainCameraIsAnimating) return
	if (true) return

	// Offset camera on pointer movement
	tickSinceLastPointerMove++
	tickSinceLastPointerMove > 5 && (pointerIsMoving = false)

	if (!pointerIsMoving) {
		cameraRotationOffset.value *= 0.9999

		Math.abs(cameraRotationOffset.value) < 0.0005 &&
			(cameraRotationOffset.value = 0)
	}

	camera.position.x =
		mainCameraParams.positionEnd.x + cameraPositionOffset.x * 1.5
	camera.position.y =
		mainCameraParams.positionEnd.y + cameraPositionOffset.y * 0.5

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

	camera.position.set(
		mainCameraParams.positionStart.x,
		mainCameraParams.positionStart.y,
		mainCameraParams.positionStart.z
	)

	camera.lookAt(
		mainCameraParams.lookAt.x,
		mainCameraParams.lookAt.y,
		mainCameraParams.lookAt.z
	)
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

	if (isDebug) {
		const { Inspector } = await import('three/addons/inspector/Inspector')
		renderer.inspector = new Inspector()
	}

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
		'/webgl/draw/product-outline.ktx2',
		'/webgl/draw/intro-outline.ktx2',
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

	noiseTexture.value = ktx[4]

	ktx[5].colorSpace = THREE.LinearSRGBColorSpace
	textures.set('product_outline', ktx[5])

	ktx[6].colorSpace = THREE.LinearSRGBColorSpace
	textures.set('intro_outline', ktx[6])

	seaNoiseTexture.value = noiseTexture.value
	godraysNoiseTexture.value = noiseTexture.value
	particlesNoiseTexture.value = noiseTexture.value

	const images = await textureLoader.load(['/webgl/bg.webp'])

	images[0].colorSpace = THREE.SRGBColorSpace

	bgTexture.value = images[0]
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
	const geometry = new THREE.PlaneGeometry(0.828, 1.36, 1, 1)
	experienceEndDrawMaterial.init(textures.get('product_outline'))
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
		const value = positionWorld.x
			.length()
			.smoothstep(0.8, 9.5)
			.oneMinus()
			.pow(4)

		const x = base.add(value)

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

async function createIntroScene() {
	introScene = new THREE.Scene()

	introCamera = new THREE.PerspectiveCamera(
		40,
		get(componentWidth) / get(componentHeight),
		0.1,
		10
	)
	introCamera.position.set(0, 0, 4)
	introCamera.lookAt(0, 0, 0)

	const geometry = new THREE.PlaneGeometry(1.682, 2.124, 1, 1)
	geometry.translate(-0.115, 0, 0)
	geometry.scale(2.3, 2.3, 1)

	experienceIntroDrawMaterial.smooth.value = 0.05
	experienceIntroDrawMaterial.init(textures.get('intro_outline'))

	introMesh = new THREE.Mesh(geometry, experienceIntroDrawMaterial.material)

	introMesh.position.set(
		introMeshParams.positionStart.x,
		introMeshParams.positionStart.y,
		introMeshParams.positionStart.z
	)

	setIntroMeshScale()

	const bg = new THREE.Mesh(
		new THREE.PlaneGeometry(12, 12, 1, 1),
		IntroBackgroundMaterial
	)

	bg.position.set(0, 0, -3)

	introScene.add(introMesh)
	introScene.add(bg)
}

function createMaskScene() {
	maskScene = new THREE.Scene()
	maskCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

	const geometry = new THREE.PlaneGeometry(2, 2)
	const mesh = new THREE.Mesh(geometry, MaskMaterial)

	maskScene.add(mesh)
}

function createPostprocessing() {
	postProcessing = new THREE.PostProcessing(renderer)

	const scenePass = pass(scene, camera)
	const introPass = pass(introScene, introCamera)
	const maskPass = pass(maskScene, maskCamera)

	const introPassColor = introPass.getTextureNode()
	const scenePassColor = scenePass.getTextureNode()
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

	const introToMain = mix(
		scenePassColor,
		introPassColor,
		introSceneVisibility
	).toVec4()

	const inner = introToMain.mul(maskPass.r).toVec4()
	const outer = borderColor.mul(maskPass.g).toVec4()
	const alpha = maskPass.r.add(maskPass.g).clamp(0, 1)

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

function setIntroMeshScale() {
	let scale = 0

	if (get(isMobile)) scale = 0.5
	else if (get(isMedium) && get(isLandscape)) scale = 0.65
	else if (get(isMedium) && get(isPortrait)) scale = 0.5
	else if (get(isDesktop) && get(isLandscape)) scale = 1
	else if (get(isDesktop) && get(isPortrait)) scale = 0.55

	introMesh.scale.set(scale, scale, 1)
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
