<template>
	<div class="webgl">
		<canvas
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>

		<ClientOnly>
			<div id="debug-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import { reflector, vec2, Fn } from 'three/tsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

import { ktxLoader, textureLoader } from '~/assets/js/loaders'

import { FloorMaterial, BackgroundMaterial } from './materials'
import { getDisplacement } from './materials/floor'

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

let scene, camera, renderer, mesh, controls

const textures = new Map()

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()
	await createRenderer()

	await loadTextures()

	createCube()
	createSea()
	createBackground()

	if (isDebug) createControls()

	gsap.ticker.add(time => {
		if (!get(visible)) return

		updateScene(time)
		renderer.render(scene, camera)
	})

	if (isDebug) {
		const { Debug } = await import('./Debug')
		new Debug()
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

	renderer.setSize(value[0], value[1])
})

//
// Methods
//
function updateScene(time = 0) {
	controls?.update()
	mesh?.rotation?.set(time * 0.2, time * 0.13, time * 0.17)
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

function createCube() {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshNormalMaterial()
	mesh = new THREE.Mesh(geometry, material)
	mesh.position.z = -1
	scene.add(mesh)
}

async function loadTextures() {
	ktxLoader.detectSupport(renderer)

	const ktx = await ktxLoader.load([
		'/webgl/bg_A.ktx2',
		'/webgl/bg_B.ktx2',
		'/webgl/bg_C.ktx2',
	])

	// const png = await textureLoader.load([
	// 	'/webgl/bg_A.png',
	// 	'/webgl/bg_B.png',
	// 	'/webgl/bg_C.png',
	// ])

	textures.set('bg_A', ktx[0])
	textures.set('bg_B', ktx[1])
	textures.set('bg_C', ktx[2])

	// textures.set('bg_A_png', png[0])
	// textures.set('bg_B_png', png[1])
	// textures.set('bg_C_png', png[2])
}

function createBackground() {
	const geometry = new THREE.PlaneGeometry(20, 10, 1, 1)
	const material = new BackgroundMaterial(textures).material
	const mesh = new THREE.Mesh(geometry, material)

	mesh.position.y = 3.5
	mesh.position.z = -5.5

	scene.add(mesh)
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

	FloorMaterial.emissiveNode = reflection.mul(0.2)

	const geometry = new THREE.PlaneGeometry(20, 10, 150, 150)
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
</script>

<style lang="scss" scoped>
.webgl {
	@apply overflow-hidden;
}

.canvas {
	@apply w-full h-full;
}

#debug-wrapper {
	@apply absolute z-[1] right-10 top-20;
}
</style>
