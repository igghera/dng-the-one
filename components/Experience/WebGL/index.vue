<template>
	<div class="webgl">
		<canvas
			id="experience-canvas"
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
import { vec2, pass, uniform, screenUV, mix, time, texture3D } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode'
import { lut3D } from 'three/addons/tsl/display/Lut3DNode'
import { WaterMeshCustom } from './WaterMeshCustom'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

import { ktxLoader, textureLoader, lutCubeLoader } from '~/assets/js/loaders'

import {
	BackgroundMaterial,
	ParticlesMaterial,
	GodraysMaterial,
	experienceIntroDrawMaterial,
	experienceEndDrawMaterial,
	MaskMaterial,
	IntroBackgroundMaterial,
} from './materials'

import { progress as backgroundProgress } from './materials/background'

import {
	offset as particlesOffset,
	speed as particlesSpeed,
	sizeMin as particlesSizeMin,
	sizeMax as particlesSizeMax,
	opacity as particlesOpacity,
	strength as particlesNoiseStrength,
} from './materials/particles'

import {
	offset as godraysOffset,
	timeSpeed as godraysTimeSpeed,
	scaleBottom as godraysScaleBottom,
	scaleTop as godraysScaleTop,
	scaleHeight as godraysScaleHeight,
	noiseScale as godraysNoiseScale,
	godraysColor,
	opacity as godraysOpacity,
	smoothTop as godraysSmoothTop,
	smoothBottom as godraysSmoothBottom,
	fresnelPower as godraysFresnelPower,
	obstructionScale as godraysObstructionScale,
} from './materials/godrays'

import {
	maskColorA as maskBorderColorA,
	maskColorB as maskBorderColorB,
	progress as maskProgress,
	borderWidth as maskBorderWidth,
	radius as maskRadius,
} from './materials/mask'

import { cart2Polar, noiseTexture } from './nodes'

import { bgTexturePortrait, bgTextureLandscape } from './nodes/textures'

import {
	threshold as bloomThreshold,
	strength as bloomStrength,
	radius as bloomRadius,
	strengthDesktop as bloomStrengthDesktop,
	radiusDesktop as bloomRadiusDesktop,
	strengthMobile as bloomStrengthMobile,
	radiusMobile as bloomRadiusMobile,
} from './nodes/bloom'

import { intensity as lutIntensity } from './nodes/lut'

const START_PARAMS = Object.freeze({
	particlesSpeed: particlesSpeed.value,
	particlesSizeMin: particlesSizeMin.value,
	particlesSizeMax: particlesSizeMax.value,
	particlesOpacity: particlesOpacity.value,
	particlesNoiseStrength: particlesNoiseStrength.value,

	godraysOffset: godraysOffset.value,
	godraysTimeSpeed: godraysTimeSpeed.value,
	godraysScaleBottom: godraysScaleBottom.value,
	godraysScaleTop: godraysScaleTop.value,
	godraysScaleHeight: godraysScaleHeight.value,
	godraysNoiseScale: godraysNoiseScale.value,
	godraysColor: godraysColor.value,
	godraysOpacity: godraysOpacity.value,
	godraysSmoothTop: godraysSmoothTop.value,
	godraysSmoothBottom: godraysSmoothBottom.value,
	godraysFresnelPower: godraysFresnelPower.value,
	godraysObstructionScale: godraysObstructionScale.value,

	backgroundProgress: backgroundProgress.value,

	maskRadius: maskRadius.value,
})

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
	introBackground,
	maskScene,
	maskCamera,
	seaMesh,
	bloomPass

const mainCameraParams = Object.freeze({
	positionStart: new THREE.Vector3(0, -0.35, 4),
	positionEnd: new THREE.Vector3(0, 0.5, 4),
	lookAt: new THREE.Vector3(0, 0, -0.35),
})

const introMeshParams = Object.freeze({
	positionStart: new THREE.Vector3(0.5, -0.6, 0),
	positionEnd: new THREE.Vector3(0.018, -0.6, 0),
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

	if (isDebug) createControls()

	emitter.emit(EVENTS.WEBGL_READY)
	uiStore.setWebglVisible(true)

	gsap.ticker.add((time, deltaTime) => {
		if (!get(visible)) return

		particlesOffset.value += particlesSpeed.value * deltaTime * 0.001
		godraysOffset.value += godraysTimeSpeed.value * deltaTime * 0.001

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
			introSceneVisibility,
			seaMesh
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
emitter.on(EVENTS.RESTART, () => {
	gsap.killTweensOf([
		camera,
		introMesh.position,
		cameraRotationOffset,
		cameraPositionOffset,
		experienceIntroDrawMaterial.progress,
		experienceEndDrawMaterial.progress,
		flashEffectRef,
		maskProgress,
		maskBorderWidth,
		maskRadius,
	])

	introMesh.position.set(
		introMeshParams.positionStart.x,
		introMeshParams.positionStart.y,
		introMeshParams.positionStart.z
	)
	experienceIntroDrawMaterial.progress.value = 0
	experienceIntroDrawMaterial.opacity.value = 1
	introSceneVisibility.value = 1

	animateInIntroShape()

	particlesSpeed.value = START_PARAMS.particlesSpeed
	particlesSizeMin.value = START_PARAMS.particlesSizeMin
	particlesSizeMax.value = START_PARAMS.particlesSizeMax
	particlesOpacity.value = START_PARAMS.particlesOpacity
	particlesNoiseStrength.value = START_PARAMS.particlesNoiseStrength

	godraysOffset.value = START_PARAMS.godraysOffset
	godraysTimeSpeed.value = START_PARAMS.godraysTimeSpeed
	godraysScaleBottom.value = START_PARAMS.godraysScaleBottom
	godraysScaleTop.value = START_PARAMS.godraysScaleTop
	godraysScaleHeight.value = START_PARAMS.godraysScaleHeight
	godraysNoiseScale.value = START_PARAMS.godraysNoiseScale
	godraysColor.value = START_PARAMS.godraysColor
	godraysOpacity.value = START_PARAMS.godraysOpacity
	godraysSmoothTop.value = START_PARAMS.godraysSmoothTop
	godraysSmoothBottom.value = START_PARAMS.godraysSmoothBottom
	godraysFresnelPower.value = START_PARAMS.godraysFresnelPower
	godraysObstructionScale.value = START_PARAMS.godraysObstructionScale

	backgroundProgress.value = START_PARAMS.backgroundProgress

	experienceEndDrawMaterial.progress.value = 0

	maskProgress.value = 0
	maskBorderWidth.value = 0
	maskRadius.value = START_PARAMS.maskRadius
})

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
			duration: 4,
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
	setIntroBackgroundSize()

	renderer.setSize(value[0], value[1])
})

watch(
	() => [get(isMobile), get(isMedium), get(isDesktop)],
	value => {
		setIntroMeshScale()

		bloomPass.strength.value = value[0]
			? bloomStrengthMobile
			: bloomStrengthDesktop
		bloomPass.radius.value = value[0] ? bloomRadiusMobile : bloomRadiusDesktop
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

	if (!isDebug) {
		camera.lookAt(
			mainCameraParams.lookAt.x,
			mainCameraParams.lookAt.y,
			mainCameraParams.lookAt.z
		)
	}

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
		powerPreference: 'high-performance',
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
		'/webgl/draw/product-outline-male.ktx2',
		'/webgl/draw/intro-outline.ktx2',
		'/webgl/draw/product-outline-female.ktx2',
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
	textures.set('product_outline_male', ktx[5])

	ktx[6].colorSpace = THREE.LinearSRGBColorSpace
	textures.set('intro_outline', ktx[6])

	ktx[7].colorSpace = THREE.LinearSRGBColorSpace
	textures.set('product_outline_female', ktx[7])

	const images = await textureLoader.load([
		'/images/bg-portrait.webp',
		'/images/bg-landscape.webp',
		'/webgl/water_normals.webp',
	])

	images[0].colorSpace = THREE.SRGBColorSpace
	images[1].colorSpace = THREE.SRGBColorSpace

	bgTexturePortrait.value = images[0]
	bgTextureLandscape.value = images[1]

	const lutCube = await lutCubeLoader.load('/webgl/lut.CUBE')
	textures.set('lut_cube', lutCube)

	images[2].wrapS = images[2].wrapT = THREE.RepeatWrapping
	textures.set('water_normals', images[2])
}

async function createParticles() {
	const map = await textureLoader.load('/webgl/particle.webp')
	map.colorSpace = THREE.SRGBColorSpace

	const count = 8000
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

	background.position.set(0, -1.1, -5.5)

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
	experienceEndDrawMaterial.init(
		textures.get('product_outline_male'),
		textures.get('product_outline_female')
	)
	const mesh = new THREE.Mesh(geometry, experienceEndDrawMaterial.material)

	mesh.position.y = 0.05

	scene.add(mesh)
}

function createSea() {
	const geometry = new THREE.PlaneGeometry(20, 10, 1, 1)

	seaMesh = new WaterMeshCustom(geometry, {
		waterNormals: textures.get('water_normals'),
		sunDirection: new THREE.Vector3(),
		sunColor: 0x00ff00,
		alpha: 1,
		distortionScale: 0.2,
		size: 10,
	})

	seaMesh.rotation.x = -Math.PI / 2
	seaMesh.position.y = -0.7

	scene.add(seaMesh)
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
	controls.target.copy(mainCameraParams.lookAt)
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

	introBackground = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		IntroBackgroundMaterial
	)

	introBackground.position.set(0, 0, -3)

	setIntroBackgroundSize()

	introScene.add(introMesh)
	introScene.add(introBackground)
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
	const scenePassColor = scenePass.getTextureNode()

	const introPass = pass(introScene, introCamera)
	const introPassColor = introPass.getTextureNode()

	const maskPass = pass(maskScene, maskCamera)

	// const scenePassViewZ = scenePass.getViewZNode()

	const uvScreen = vec2(screenUV.x, screenUV.y.oneMinus())
	const polar = cart2Polar(uvScreen.sub(0.5))
	const angle = polar.y.toVar()
	const angleOffset = (Math.PI / 180) * 70

	const borderMix = angle
		.add(time.mul(0.25))
		.add(angleOffset)
		.mul(2)
		.sin()
		.mul(0.5)
		.add(0.5)
		.smoothstep(0.17, 0.83)
	const borderColor = mix(maskBorderColorA, maskBorderColorB, borderMix)

	const introToMain = mix(
		scenePassColor,
		introPassColor,
		introSceneVisibility
	).toVec4()

	bloomPass = bloom(introToMain)
	bloomPass.strength = bloomStrength
	bloomPass.radius = bloomRadius
	bloomPass.threshold = bloomThreshold

	if (get(isMobile)) {
		bloomPass.strength.value = bloomStrengthMobile
		bloomPass.radius.value = bloomRadiusMobile
	}

	const inner = introToMain.add(bloomPass).mul(maskPass.r).toVec4()
	const outer = borderColor.mul(maskPass.g).toVec4()
	const alpha = maskPass.r.add(maskPass.g).clamp(0, 1)

	let compose = inner.add(outer).mul(alpha)

	const lutPass = lut3D(
		compose,
		texture3D(textures.get('lut_cube').texture3D),
		textures.get('lut_cube').texture3D.image.width
	)
	lutPass.intensityNode = lutIntensity

	postProcessing.outputNode = lutPass
	// postProcessing.outputNode = maskPass
}

function setBackgroundSize() {
	if (!!!background) return

	if (get(isPortrait)) background.scale.set(10.8, 19.2, 1)
	else if (get(isLandscape)) background.scale.set(19.2, 10.8, 1)
}

function setIntroBackgroundSize() {
	if (!!!introBackground) return

	if (get(isPortrait))
		introBackground.scale.set(11.79, 25.56, 1).multiplyScalar(0.5)
	else if (get(isLandscape))
		introBackground.scale.set(28.8, 20.48, 1).multiplyScalar(0.5)
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
	@apply grid overflow-hidden size-[inherit];
}

.canvas,
.flash-effect {
	@apply w-full h-full col-start-1 row-start-1;
}

.flash-effect {
	@apply pointer-events-none bg-gold-dark opacity-0;
}
</style>
