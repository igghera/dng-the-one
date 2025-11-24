<template>
	<div class="explore">
		<canvas
			id="explore-canvas"
			class="canvas"
			ref="canvasRef"
			:width="componentWidth"
			:height="componentHeight"
		/>

		<div class="explore-content" ref="css3DContentRef">
			<div
				v-for="(item, idx) in itemsMerged"
				:key="idx"
				class="socket"
				:style="{
					'--w': `${item.mainImage.width * item.scaleFactor}px`,
					'--h': `${item.mainImage.height * item.scaleFactor}px`,
					'pointer-events': 'none',
				}"
				:data-id="idx"
				ref="socketRefs"
			>
				<picture class="pic">
					<img
						class="img"
						:src="item.mainImage.src"
						alt=""
						draggable="false"
						loading="lazy"
						decoding="async"
					/>
				</picture>

				<div class="product-pictures">
					<template v-for="(option, pidx) in item.options" :key="pidx">
						<ExplorePin
							class="pin"
							:style="{
								'--x': `${option.pin.x}`,
								'--y': `${option.pin.y}`,
							}"
						/>

						<picture class="pic">
							<img
								class="img"
								:src="option.imageSrc"
								alt=""
								draggable="false"
							/>
						</picture>
					</template>
				</div>

				<div class="year">
					{{ item.year }}
				</div>

				<div v-if="item.title" class="title" v-html="item.title" />

				<div v-if="item.copy" class="copy" v-html="item.copy" />
			</div>
		</div>
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
const socketRefs = useTemplateRef('socketRefs')

const isVisible = useElementVisibility(el)
const { width: componentWidth, height: componentHeight } =
	useElementBounding(el)

const { gsap } = useGSAP()
const { rt, tm } = useI18n()

const textures = new Map()

let renderer, rendererCSS, scene, camera, controls, bg0, bg1

const itemsData = [
	{
		position: {
			x: -1.5,
			y: -0.58,
			z: 0,
		},
		scaleFactor: 0.4,
		mainImage: {
			src: '/images/explore/socket_01/00-dark.webp',
			width: 671,
			height: 652,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_01/00-light.webp',
				pin: {
					x: 0.5,
					y: 0.85,
				},
			},
		],
	},
	{
		position: {
			x: -1.025,
			y: -0.355,
			z: 0,
		},
		scaleFactor: 0.37,
		mainImage: {
			src: '/images/explore/socket_02/00-dark.webp',
			width: 506,
			height: 429,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_02/00-light.webp',
				pin: {
					x: 0.53,
					y: 0.72,
				},
			},
		],
	},
	{
		position: {
			x: -0.425,
			y: -0.109,
			z: 0,
		},
		scaleFactor: 0.43,
		mainImage: {
			src: '/images/explore/socket_03/00-dark.webp',
			width: 606,
			height: 667,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_03/00-light.webp',
				pin: {
					x: 0.53,
					y: 0.78,
				},
			},
		],
	},
	{
		position: {
			x: 0.151,
			y: -0.3675,
			z: 0,
		},
		scaleFactor: 0.353,
		mainImage: {
			src: '/images/explore/socket_04/00-dark.webp',
			width: 784,
			height: 486,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_04/00-light.webp',
				pin: {
					x: 0.38,
					y: 0.78,
				},
			},
			{
				imageSrc: '/images/explore/socket_04/01-light.webp',
				pin: {
					x: 0.72,
					y: 0.73,
				},
			},
		],
	},
	{
		position: {
			x: 1.01,
			y: -0.3,
			z: 0,
		},
		scaleFactor: 0.353,
		mainImage: {
			src: '/images/explore/socket_05/00-dark.webp',
			width: 1277,
			height: 791,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_05/00-light.webp',
				pin: {
					x: 0.42,
					y: 0.89,
				},
			},
			{
				imageSrc: '/images/explore/socket_05/01-light.webp',
				pin: {
					x: 0.55,
					y: 0.89,
				},
			},
			{
				imageSrc: '/images/explore/socket_05/02-light.webp',
				pin: {
					x: 0.71,
					y: 0.85,
				},
			},
			{
				imageSrc: '/images/explore/socket_05/03-light.webp',
				pin: {
					x: 0.81,
					y: 0.8,
				},
			},
		],
	},
]

const targets = itemsData.map(item => {
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(
			item.mainImage.width * item.scaleFactor * 0.001,
			item.mainImage.height * item.scaleFactor * 0.001
		),
		new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.3,
			color: 0x00ff00,
			colorWrite: false,
		})
	)

	mesh.position.copy(item.position)

	return mesh
})

//
// Computed
//
const itemsCopy = computed(() => {
	return tm('explore.items').map(item => {
		return {
			year: rt(item.year),
			title: rt(item.title),
			copy: rt(item.copy),
		}
	})
})

const itemsMerged = computed(() => {
	return get(itemsCopy).map((item, idx) => {
		return {
			...item,
			...itemsData[idx],
		}
	})
})

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
	createCameraTargets()

	createControls()

	gsap.delayedCall(1, async () => {
		await controls.fitToBox(targets[0], true, {
			cover: false,
			paddingTop: 0.35,
			paddingBottom: 0.35,
		})

		controls.enabled = true
	})

	gsap.ticker.add((time, deltaTime) => {
		if (!get(isVisible)) return

		controls?.update(deltaTime * 0.001)

		updateScene(time)

		renderer.render(scene, camera)
		rendererCSS.render(scene, camera)
	})
})

//
// Watchers
//
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
		6
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

	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.setSize(get(componentWidth), get(componentHeight))
	renderer.setPixelRatio(1)

	await renderer.init()
}

function createBackground() {
	const geometry = new THREE.PlaneGeometry(3.84, 2.16)

	bg0 = new THREE.Mesh(
		geometry,
		makeBackgroundMaterial(textures.get('line-copper'))
	)
	bg0.position.set(0.045, 0, -0.01)
	scene.add(bg0)

	bg1 = new THREE.Mesh(
		geometry.clone(),
		makeBackgroundMaterial(textures.get('line-gold'))
	)
	scene.add(bg1)
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

	const bb = new THREE.Box3(
		new THREE.Vector3(-1.92, -1.08, 0),
		new THREE.Vector3(1.92, 1.08, 8)
	)
	controls.setBoundary(bb)

	controls.fitToBox(bg1, false, { cover: false })

	controls.enabled = false
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
	// Scale factor to convert CSS pixels to Three.js world units
	// Based on camera distance and scene scale, objects should appear ~0.001-0.002 units per pixel
	const SCALE_FACTOR = 0.001

	get(socketRefs).forEach((item, idx) => {
		const obj = new CSS3DObject(item)

		obj.position.copy(itemsData[idx].position)

		// Scale down CSS3D objects to match the scene's coordinate system
		obj.scale.setScalar(SCALE_FACTOR)

		scene.add(obj)
	})
}

function createCameraTargets() {
	targets.forEach(target => {
		scene.add(target)
	})
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.explore {
	@apply grid h-[100svh];

	background-color: #1b0b08;

	> * {
		@apply col-start-1 row-start-1 size-full;
	}
}

.explore-content {
	@apply pointer-events-none relative size-full top-0 left-0;

	top: env(safe-area-inset-top, 0);
	left: env(safe-area-inset-left, 0);
}

:deep(.socket) {
	@apply grid text-gold text-center uppercase;

	height: var(--h);
	width: var(--w);

	> * {
		@apply col-start-1 row-start-1;
	}

	.pic {
		display: block;
		overflow: hidden;
	}

	.img {
		@apply size-full object-contain object-center;
	}

	.product-pictures {
		@apply grid;

		> * {
			@apply col-start-1 row-start-1;
		}

		.pic {
			@apply transition-opacity duration-500 opacity-0;
		}

		.pin:hover + .pic {
			@apply opacity-100;
		}
	}

	:is(.year, .title, .copy) {
		@apply self-center pointer-events-none;
	}

	.year {
		font-size: toRem(60);
	}

	.title {
		font-size: toRem(18);
	}

	.copy {
		font-size: toRem(18);
	}

	.pin {
		@apply size-12 relative z-[1] cursor-pointer;

		translate: calc(var(--x) * var(--w) - 50%) calc(var(--y) * var(--h) - 50%);
	}

	&[data-id='0'] {
		.year {
			translate: 0 calc(var(--h) * -0.75);
		}

		.copy {
			translate: 0 calc(var(--h) * 0.75);
		}
	}

	&[data-id='1'] {
		.year {
			translate: 0 calc(var(--h) * 1.1);
		}

		.title {
			translate: 0 calc(var(--h) * 1.55);
		}

		.copy {
			translate: 0 calc(var(--h) * -0.9);
		}
	}

	&[data-id='2'] {
		.year {
			translate: 0 calc(var(--h) * -1.1);
		}

		.title {
			translate: 0 calc(var(--h) * -0.85);
		}

		.copy {
			translate: 0 calc(var(--h) * 0.8);
		}
	}

	&[data-id='3'] {
		.year {
			translate: 0 calc(var(--h) * 0.9);
		}

		.title {
			translate: 0 calc(var(--h) * 1.3);
		}

		.copy {
			translate: 0 calc(var(--h) * -1);
		}
	}

	&[data-id='4'] {
		.year {
			translate: 0 calc(var(--h) * -1.1);
		}

		.title {
			translate: 0 calc(var(--h) * -0.82);
		}
	}
}
</style>
