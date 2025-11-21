<template>
	<div class="explore">
		<canvas
			id="explore-canvas"
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>

		<div class="explore-content" ref="css3DContentRef"></div>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import {
	CSS3DRenderer,
	CSS3DObject,
} from 'three/addons/renderers/CSS3DRenderer'
import CameraControls from 'camera-controls'
import { get } from '@vueuse/core'

import { ktxLoader } from '~/assets/js/loaders'
import { makeBackgroundMaterial } from './materials/background'

//
// Refs / State
//
const el = useCurrentElement()
const canvasRef = useTemplateRef('canvasRef')
const css3DContentRef = useTemplateRef('css3DContentRef')

const { pixelRatio } = useDevicePixelRatio()
const isVisible = useElementVisibility(el)
const { width: componentWidth, height: componentHeight } =
	useElementBounding(el)

const { gsap } = useGSAP()

const textures = new Map()

let renderer, rendererCSS, scene, camera, controls, bg0, bg1, targetElement

//
// Lifecycle
//
onMounted(async () => {
	createScene()
	createCamera()

	await createRenderer()
	await loadTextures()

	createBackground()
	createDOM()

	createControls()

	gsap.delayedCall(1, () => {
		controls.fitToBox(targetElement, true, {
			cover: false,
			paddingLeft: 0.04,
			paddingRight: 0.04,
		})
	})

	gsap.ticker.add((time, deltaTime) => {
		if (!get(isVisible)) return

		controls?.update(deltaTime)

		updateScene(time)

		renderer.render(scene, camera)
		rendererCSS.render(scene, camera)
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
	rendererCSS.setSize(value[0], value[1])
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
	rendererCSS = new CSS3DRenderer()
	rendererCSS.setSize(get(componentWidth), get(componentHeight))
	get(css3DContentRef).appendChild(rendererCSS.domElement)

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

	bg0 = new THREE.Mesh(
		geometry,
		makeBackgroundMaterial(textures.get('line-copper'))
	)
	bg0.position.set(0, 0, -0.01)
	scene.add(bg0)

	bg1 = new THREE.Mesh(
		geometry.clone(),
		makeBackgroundMaterial(textures.get('line-gold'))
	)
	scene.add(bg1)

	targetElement = new THREE.Mesh(
		new THREE.PlaneGeometry(0.5, 0.3),
		new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.5,
		})
	)
	targetElement.position.set(0, 0.5, 0)
	scene.add(targetElement)
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

	controls.fitToBox(bg1)
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

function createDOM() {
	const el = document.createElement('div')
	el.className = 'explore-content-item'

	el.textContent = 'Hello HTML'

	Object.assign(el.style, {
		color: 'white',
		fontSize: '0.1px',
		fontWeight: 'bold',
		textAlign: 'center',
		backgroundColor: '#ff000050',
		width: '1px',
		height: '0.5px',
		lineHeight: '1',
		pointerEvents: 'none',
	})

	const obj = new CSS3DObject(el)
	obj.position.set(0, 0.3, 0)
	scene.add(obj)
}
</script>

<style lang="scss" scoped>
.explore {
	@apply grid;

	> * {
		@apply col-start-1 row-start-1 size-full;
	}
}

.explore-content {
	@apply pointer-events-none;
}
</style>
