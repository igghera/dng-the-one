<template>
	<div class="webgl">
		<canvas
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>

		<ClientOnly>
			<div id="stats-wrapper" v-if="isDebug"></div>
			<div id="debug-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import { reflector, vec2, Fn, pass, uniform } from 'three/tsl'
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

import { ktxLoader, textureLoader } from '~/assets/js/loaders'

import {
	FloorMaterial,
	BackgroundMaterial,
	ParticlesMaterial,
	GodraysMaterial,
} from './materials'
import {
	getDisplacement,
	noiseTexture as seaNoiseTexture,
} from './materials/floor'

import { noiseTexture as godraysNoiseTexture } from './materials/godrays'

//
// Refs / State
//
const { gsap } = useGSAP()

const el = useCurrentElement()
const canvasRef = useTemplateRef('canvasRef')

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
	statsPanel

const textures = new Map()

const dofParams = Object.freeze({
	focusDistance: uniform(4.9),
	focalLength: uniform(8.4),
	bokehScale: uniform(8),
})

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()

	await createRenderer()
	await loadTextures()

	createSea()
	createBackground()
	createGodrays()

	await createParticles()

	createPostprocessing()

	if (isDebug) createControls()

	gsap.ticker.add(time => {
		if (!get(visible)) return

		updateScene(time)
		// renderer.renderAsync(scene, camera)
		postProcessing.renderAsync()

		renderer.resolveTimestampsAsync(THREE.TimestampQuery.RENDER)

		statsPanel?.update()
	})

	if (isDebug) {
		const { Debug } = await import('./Debug')
		new Debug(dofParams, godrays, background)

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

	await renderer.init()

	renderer.toneMapping = THREE.ACESFilmicToneMapping

	renderer.setSize(get(componentWidth), get(componentHeight))
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
}

async function createParticles() {
	const map = await textureLoader.load('/webgl/particle.webp')
	map.colorSpace = THREE.SRGBColorSpace

	const count = 900
	const positions = new Float32Array(count * 3)

	let i, radius
	for (i = 0; i < count; i++) {
		radius = gsap.utils.random(0.15, 1)
		const x = Math.cos(i * 0.01 * Math.PI * 2) * radius
		const y = Math.random() * 4 - 1
		const z = Math.sin(i * 0.01 * Math.PI * 2) * radius

		positions[i * 3 + 0] = x
		positions[i * 3 + 1] = y
		positions[i * 3 + 2] = z
	}
	const positionsAttribute = new THREE.InstancedBufferAttribute(positions, 3)

	const { material } = new ParticlesMaterial(map, positionsAttribute)

	const particles = new THREE.Sprite(material)
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

function createSea() {
	const reflection = reflector({ resolutionScale: 0.5 })
	reflection.target.rotateX(-Math.PI / 2)
	reflection.target.position.y = -1

	const uvDisplacement = Fn(() => {
		return vec2(getDisplacement.x.mul(0.3), getDisplacement.y.mul(0.3))
	})()

	reflection.uvNode = reflection.uvNode.add(uvDisplacement)

	scene.add(reflection.target)

	FloorMaterial.emissiveNode = reflection.mul(0.7)

	const geometry = new THREE.PlaneGeometry(20, 10, 250, 150)
	geometry.rotateX(-Math.PI / 2)
	const mesh = new THREE.Mesh(geometry, FloorMaterial)
	mesh.position.y = -1
	scene.add(mesh)
}

function createControls() {
	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.enableZoom = false
}

function createPostprocessing() {
	postProcessing = new THREE.PostProcessing(renderer)

	const scenePass = pass(scene, camera)
	const scenePassColor = scenePass.getTextureNode()
	const scenePassViewZ = scenePass.getViewZNode()

	const dofPass = dof(
		scenePassColor,
		scenePassViewZ,
		dofParams.focusDistance,
		dofParams.focalLength,
		dofParams.bokehScale
	)

	postProcessing.outputNode = dofPass
}

function setBackgroundSize() {
	if (!!!background) return

	if (get(isPortrait)) background.scale.set(10.8, 19.2, 1)
	else if (get(isLandscape)) background.scale.set(19.2, 10.8, 1)
}
</script>

<style lang="scss" scoped>
.webgl {
	@apply overflow-hidden;
}

.canvas {
	@apply w-full h-full;
}

#debug-wrapper {
	@apply absolute z-[1] right-10 top-20 w-80;
}

#stats-wrapper {
	@apply absolute z-[1] left-1 top-20;
}
</style>
