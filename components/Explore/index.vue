<template>
	<div class="explore">
		<canvas
			id="explore-canvas"
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import CameraControls from 'camera-controls'
import { get } from '@vueuse/core'

import { ktxLoader } from '~/assets/js/loaders'
import { makeBackgroundMaterial } from './materials/background'

//
// Refs / State
//
const el = useCurrentElement()

const canvasRef = useTemplateRef('canvasRef')

const { pixelRatio } = useDevicePixelRatio()
const isVisible = useElementVisibility(el)
const { width: componentWidth, height: componentHeight } =
	useElementBounding(el)

const { gsap } = useGSAP()

const textures = new Map()

let renderer, scene, camera, controls

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()

	await createRenderer()
	await loadTextures()

	createBackground()

	createControls()

	gsap.ticker.add((time, deltaTime) => {
		if (!get(isVisible)) return

		controls?.update(deltaTime)

		updateScene(time)

		renderer.render(scene, camera)
	})
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

	renderer.setSize(value[0], value[1])
})

//
// Methods
//
function createScene() {
	scene = new THREE.Scene()
}

function createCamera() {
	camera = new THREE.PerspectiveCamera(
		40,
		get(componentWidth) / get(componentHeight),
		0.1,
		50
	)

	camera.position.set(0, 0, 5)
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

	await renderer.init()
}

function createBackground() {
	const geometry = new THREE.PlaneGeometry(3.84, 2.16)

	const mesh0 = new THREE.Mesh(
		geometry,
		makeBackgroundMaterial(textures.get('line-copper'))
	)
	mesh0.position.set(0, 0, -0.01)
	scene.add(mesh0)

	const mesh1 = new THREE.Mesh(
		geometry.clone(),
		makeBackgroundMaterial(textures.get('line-gold'))
	)
	scene.add(mesh1)
}

function createControls() {
	CameraControls.install({ THREE: THREE })

	controls = new CameraControls(camera, renderer.domElement)

	controls.mouseButtons.left = CameraControls.ACTION.TRUCK
	controls.mouseButtons.middle = CameraControls.ACTION.TRUCK
	controls.mouseButtons.right = CameraControls.ACTION.TRUCK
	controls.mouseButtons.wheel = CameraControls.ACTION.NONE

	controls.touches.one = CameraControls.ACTION.TRUCK
	controls.touches.two = CameraControls.ACTION.TRUCK
	controls.touches.three = CameraControls.ACTION.TRUCK

	console.log(controls)
}

function updateScene(time = 0) {}

async function loadTextures() {
	ktxLoader.detectSupport(renderer)

	const ktx = await ktxLoader.load([
		'/webgl/draw/line-copper.ktx2',
		'/webgl/draw/line-gold.ktx2',
	])

	ktx[0].colorSpace = THREE.SRGBColorSpace
	ktx[1].colorSpace = THREE.SRGBColorSpace

	textures.set('line-copper', ktx[0])
	textures.set('line-gold', ktx[1])
}
</script>
