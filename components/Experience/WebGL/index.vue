<template>
	<div class="webgl">
		<canvas
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

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

let perfPanel, scene, camera, renderer, mesh, controls

//
// Lifecycle
//
onMounted(() => {
	createScene()
	createCamera()
	createRenderer()

	createCube()

	createControls()

	gsap.ticker.add(time => {
		if (!get(visible)) return

		console.log('render')

		updateScene(time)
		renderer.renderAsync(scene, camera)
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

	camera.position.set(0, 1, 4)
	camera.lookAt(0, 0, 0)
}

function createRenderer() {
	renderer = new THREE.WebGPURenderer({
		canvas: get(canvasRef),
		alpha: true,
		antialias: true,
	})

	renderer.setSize(get(componentWidth), get(componentHeight))
}

function createCube() {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshNormalMaterial()
	mesh = new THREE.Mesh(geometry, material)
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
</style>
