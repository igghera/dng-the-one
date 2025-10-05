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
import { reflector, vec2, positionWorld, Fn } from 'three/tsl'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { get } from '@vueuse/core'

import { FloorMaterial } from './materials'
import { displacementFrequency, displacementAmplitude } from './materials/floor'

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

let perfPanel, scene, camera, renderer, mesh, controls

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()
	createRenderer()

	createCube()
	createFloor()

	if (isDebug) createControls()

	gsap.ticker.add(time => {
		if (!get(visible)) return

		updateScene(time)
		renderer.renderAsync(scene, camera)
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

	camera.position.set(0, 1, 4)
	camera.lookAt(0, 0, 0)
}

function createRenderer() {
	renderer = new THREE.WebGPURenderer({
		canvas: get(canvasRef),
		alpha: true,
		antialias: true,
	})

	renderer.toneMapping = THREE.ACESFilmicToneMapping

	renderer.setSize(get(componentWidth), get(componentHeight))
}

function createCube() {
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshNormalMaterial()
	mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)
}

function createFloor() {
	const reflection = reflector({ resolutionScale: 0.5 })
	reflection.target.rotateX(-Math.PI / 2)
	reflection.target.position.y = -1

	const uvDisplacement = Fn(() => {
		const displacement = positionWorld.x
			.mul(displacementFrequency)
			.sin()
			.mul(displacementAmplitude)
		return vec2(0, displacement.mul(0.3))
	})()

	reflection.uvNode = reflection.uvNode.add(uvDisplacement)

	scene.add(reflection.target)

	FloorMaterial.emissiveNode = reflection.mul(0.2)

	const geometry = new THREE.PlaneGeometry(10, 10, 150, 150)
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
