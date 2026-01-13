<template>
	<div
		class="explore"
		:data-visible="init"
		:data-text-visible="copyVisible"
		:data-pins-visible="pinsVisible"
	>
		<div
			class="!w-5 !h-5 bg-[#f00] relative z-[2] invisible"
			ref="draggableDummyRef"
		/>

		<div
			class="top-gradient"
			:data-visible="css3DContentVisible"
			aria-hidden="true"
		/>

		<Logo20Years class="logo | multi-shadow" ref="logoRef" />

		<div class="intro">
			<p
				class="intro-text | multi-shadow"
				v-html="$t('explore.intro')"
				ref="introTextRef"
			/>

			<ButtonPressAndHold
				class="pointer-events-auto"
				:on-complete="introButtonOnCompleteCallback"
				ref="introButtonRef"
			/>
		</div>

		<p class="instructions" ref="instructionsRef">
			{{ $t('explore.instructions') }}
		</p>

		<canvas
			id="explore-canvas"
			class="canvas"
			ref="canvasRef"
			:width="canvasSize.width"
			:height="canvasSize.height"
		/>

		<div
			class="explore-content"
			:data-visible="css3DContentVisible"
			ref="css3DContentRef"
		>
			<div
				v-for="(item, idx) in itemsMerged"
				:key="idx"
				class="socket"
				:style="{
					'--w': `${
						Math.floor(item.mainImage.width * item.scaleFactor) % 2 === 0
							? Math.floor(item.mainImage.width * item.scaleFactor)
							: Math.floor(item.mainImage.width * item.scaleFactor) - 1
					}px`,
					'--h': `${
						Math.floor(item.mainImage.height * item.scaleFactor) % 2 === 0
							? Math.floor(item.mainImage.height * item.scaleFactor)
							: Math.floor(item.mainImage.height * item.scaleFactor) - 1
					}px`,
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
						<button
							class="pin"
							:style="{
								'--x': `${option.pin.x}`,
								'--y': `${option.pin.y}`,
							}"
							:data-id="`${idx}_${pidx}`"
							@pointerdown="handlePinPointerdown"
							aria-label="open panel"
						>
							<ExplorePin />
						</button>

						<picture
							class="pic"
							:data-current="currentProduct === `${idx}_${pidx}`"
						>
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

		<div
			class="panel"
			:data-open="panelOpen"
			:data-open-full="panelOpenFull"
			:data-can-scroll="panelCanScroll"
			ref="panelRef"
		>
			<button
				class="panel-close-button"
				@click="closePanel"
				aria-label="close panel"
				ref="closeButtonRef"
			>
				<IconClose class="relative z-[1]" />
			</button>

			<div
				class="panel-scroller | no-scrollbar | overflow-y-auto"
				ref="panelScrollerRef"
			>
				<div
					v-if="currentProductData"
					class="panel-content"
					ref="panelContentRef"
				>
					<template v-for="(item, idx) in currentProductData" :key="idx">
						<div v-if="item.component === 'title'" class="panel-content-header">
							<span v-html="item.value[0]" class="panel-content-title" />
							<span v-html="item.value?.[1]" class="panel-content-subtitle" />
						</div>

						<div
							v-if="item.component === 'p'"
							class="panel-content-copy"
							v-html="item.value"
						/>

						<ButtonGolden
							v-if="item.component === 'cta'"
							:to="item.value"
							size="wide"
							target="_blank"
							class="panel-content-cta"
						>
							{{ $t('shop_now') }}
						</ButtonGolden>

						<picture
							v-if="item.component === 'image'"
							class="panel-content-image"
						>
							<img
								:src="item.value"
								:alt="item.title"
								loading="lazy"
								decoding="async"
								draggable="false"
							/>
						</picture>

						<div v-if="item.component === 'video'" class="panel-content-video">
							<video
								:src="item.value"
								:poster="item.poster"
								controls
								preload="metadata"
								playsinline
							/>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import * as THREE from 'three/webgpu'
import { bloom } from 'three/addons/tsl/display/BloomNode'
import { pass } from 'three/tsl'
import {
	CSS3DRenderer,
	CSS3DObject,
} from 'three/addons/renderers/CSS3DRenderer'
import CameraControls from 'camera-controls'
import { get, set } from '@vueuse/core'
import { Howler } from 'howler'
import slugify from 'voca/slugify'

import { ktxLoader } from '~/assets/js/loaders'
import { backgroundCopper, backgroundGold } from './materials/background'
import {
	threshold as bloomThreshold,
	strength as bloomStrength,
	radius as bloomRadius,
} from './nodes/bloom'

//
// Refs / State
//
const el = useCurrentElement()
const logoRef = useTemplateRef('logoRef')
const introTextRef = useTemplateRef('introTextRef')
const introButtonRef = useTemplateRef('introButtonRef')
const instructionsRef = useTemplateRef('instructionsRef')
const canvasRef = useTemplateRef('canvasRef')
const css3DContentRef = useTemplateRef('css3DContentRef')
const socketRefs = useTemplateRef('socketRefs')
const panelRef = useTemplateRef('panelRef')
const closeButtonRef = useTemplateRef('closeButtonRef')
const panelScrollerRef = useTemplateRef('panelScrollerRef')
const panelContentRef = useTemplateRef('panelContentRef')
const draggableDummyRef = useTemplateRef('draggableDummyRef')

const appStore = useAppStore()
const uiStore = useUiStore()

const { isMobile } = useViewport()

const isVisible = useElementVisibility(el)
const { width: componentWidth, height: componentHeight } =
	useElementBounding(el)
const { height: panelScrollerHeight } = useElementBounding(panelScrollerRef)
const { height: panelContentHeight } = useElementBounding(panelContentRef)

const { gsap, SplitText, Observer, Draggable } = useGSAP()
const { rt, tm } = useI18n()

const textures = new Map()

const init = shallowRef(false)
const currentProduct = shallowRef(null)
const currentProductData = shallowRef(null)
const css3DContentVisible = shallowRef(false)
const panelOpen = shallowRef(false)
const panelOpenFull = shallowRef(false)
const copyVisible = shallowRef(false)
const pinsVisible = shallowRef(false)

let renderer, rendererCSS, scene, camera, controls, bg0, bg1, postProcessing
let cameraZ = 5
let introSplit, instructionsSplit, panelPointerObserver
let debugPanel, statsPanel
let curve = null,
	dragProgress = { value: 0 },
	draggableInstance = null

const controlsPositionMemo = new THREE.Vector3()

const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')

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
			y: -0.358,
			z: 0,
		},
		scaleFactor: 0.37,
		mainImage: {
			src: '/images/explore/socket_04/00-dark.webp',
			width: 784,
			height: 486,
		},
		options: [
			{
				imageSrc: '/images/explore/socket_04/00-light.webp',
				pin: {
					x: 0.42,
					y: 0.62,
				},
			},
			{
				imageSrc: '/images/explore/socket_04/01-light.webp',
				pin: {
					x: 0.77,
					y: 0.58,
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
	const size = 650 * 0.4 * 0.001

	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(size, size),
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
const canvasSize = computed(() => {
	const width =
		get(componentWidth) % 2 === 0
			? get(componentWidth)
			: get(componentWidth) - 1
	const height =
		get(componentHeight) % 2 === 0
			? get(componentHeight)
			: get(componentHeight) - 1

	return {
		width,
		height,
	}
})

const itemsCopy = computed(() => {
	return tm('explore.items').map(item => {
		return {
			year: rt(item.year),
			title: rt(item.title),
			copy: rt(item.copy),
			data: item.data.map(data => {
				return data.map(item => {
					return {
						component: rt(item.component),
						value: Array.isArray(item.value)
							? item.value.map(v => rt(v))
							: rt(item.value),
						poster: item.component === 'video' ? rt(item.poster) : null,
					}
				})
			}),
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

const panelsData = computed(() => {
	const map = new Map()

	get(itemsMerged).forEach((item, idx) => {
		item.options.forEach((option, pidx) => {
			map.set(`${idx}_${pidx}`, item.data[pidx])
		})
	})

	return map
})

const panelCanScroll = computed(() => {
	return get(panelContentHeight) > get(panelScrollerHeight)
})

//
// Misc
//
onClickOutside(
	panelRef,
	() => {
		if (!get(panelOpen)) return

		closePanel()
		controls.enabled = true
	},
	{
		ignore: ['.pin', '.button-audio'],
	}
)

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	setInitialStyles()

	Tracking.sendEvent({
		content_type: 'navigation',
		customizator_option: '',
		generic_event_and_label: 'explore_the_collection',
	})

	createScene()
	createCamera()

	await createRenderer()
	await loadTextures()

	createBackground()
	createDOM()
	createCameraTargets()

	createControls()
	createPanelPointerObserver()
	createDrag()

	createPostprocessing()

	set(init, true)

	gsap.set(get(el), { clearProps: '-webkit-user-select' })

	gsap.delayedCall(0.4, () => {
		animateInBackground()

		gsap.delayedCall(1.5, () => {
			animateInIntro()
		})
	})

	gsap.ticker.add((time, deltaTime) => {
		if (!get(isVisible)) return

		controls?.update(deltaTime * 0.001)

		updateScene(time)

		// renderer.render(scene, camera)
		postProcessing.render()
		rendererCSS.render(scene, camera)

		renderer.resolveTimestampsAsync(THREE.TimestampQuery.RENDER)

		statsPanel?.update()
		debugPanel?.pane?.refresh()
	})

	if (isDebug) {
		const { ExploreDebug } = await import('./Debug')
		debugPanel = new ExploreDebug()

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
watch([componentWidth, componentHeight], value => {
	if (!camera) return

	const width = value[0] % 2 === 0 ? value[0] : value[0] - 1
	const height = value[1] % 2 === 0 ? value[1] : value[1] - 1

	camera.aspect = width / height
	camera.updateProjectionMatrix()

	if (!renderer) return

	renderer.setSize(width, height)

	rendererCSS.setSize(width, height)
})

//
// Methods
//
function setInitialStyles() {
	gsap.set([get(logoRef).$el, get(introButtonRef).$el], {
		autoAlpha: 0,
	})

	introSplit = SplitText.create(get(introTextRef), {
		type: 'lines,words,chars',
		charsClass: 'char',
	})
	gsap.set(introSplit.chars, { opacity: 0 })

	instructionsSplit = SplitText.create(get(instructionsRef), {
		type: 'words,chars',
	})
	gsap.set(instructionsSplit.chars, { opacity: 0 })
}

function createScene() {
	scene = new THREE.Scene()
}

function createCamera() {
	camera = new THREE.PerspectiveCamera(
		40,
		get(canvasSize).width / get(canvasSize).height,
		0.1,
		20
	)

	camera.position.set(0, 0, cameraZ)
}

async function createRenderer() {
	rendererCSS = new CSS3DRenderer()
	rendererCSS.setSize(get(canvasSize).width, get(canvasSize).height)
	get(css3DContentRef).appendChild(rendererCSS.domElement)

	renderer = new THREE.WebGPURenderer({
		canvas: get(canvasRef),
		alpha: true,
		antialias: true,
		powerPreference: 'high-performance',
	})

	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.setSize(get(canvasSize).width, get(canvasSize).height)
	renderer.setPixelRatio(1)

	await renderer.init()
}

function createBackground() {
	const geometry = new THREE.PlaneGeometry(3.84, 2.16)

	backgroundCopper.name = 'Copper'
	backgroundCopper.map.value = textures.get('line-copper-desktop')
	backgroundCopper.drawMask.value = textures.get(
		'line-copper-desktop-mask-draw'
	)
	backgroundCopper.beamMask.value = textures.get(
		'line-copper-desktop-mask-beam'
	)
	bg0 = new THREE.Mesh(geometry, backgroundCopper.material)
	bg0.position.set(0.045, 0, -0.01)
	scene.add(bg0)

	backgroundGold.name = 'Gold'
	backgroundGold.map.value = textures.get('line-gold-desktop')
	backgroundGold.drawMask.value = textures.get('line-gold-desktop-mask-draw')
	backgroundGold.beamMask.value = textures.get('line-gold-desktop-mask-beam')
	bg1 = new THREE.Mesh(geometry.clone(), backgroundGold.material)
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
		'/webgl/draw/line-copper-desktop.ktx2',
		'/webgl/draw/line-gold-desktop.ktx2',
		'/webgl/draw/line-copper-mobile.ktx2',
		'/webgl/draw/line-gold-mobile.ktx2',
		'/webgl/draw/explore-mask.ktx2',
		'/webgl/draw/line-copper-desktop-mask-draw.ktx2',
		'/webgl/draw/line-gold-desktop-mask-draw.ktx2',
		'/webgl/draw/line-copper-desktop-mask-beam.ktx2',
		'/webgl/draw/line-gold-desktop-mask-beam.ktx2',
	])

	ktx[0].colorSpace = THREE.SRGBColorSpace
	ktx[1].colorSpace = THREE.SRGBColorSpace
	ktx[2].colorSpace = THREE.SRGBColorSpace
	ktx[3].colorSpace = THREE.SRGBColorSpace

	ktx[4].colorSpace = THREE.NoColorSpace
	ktx[4].wrapS = ktx[4].wrapT = THREE.NoWrapping

	ktx[5].colorSpace = THREE.NoColorSpace
	ktx[5].wrapS = ktx[5].wrapT = THREE.NoWrapping

	ktx[6].colorSpace = THREE.NoColorSpace
	ktx[6].wrapS = ktx[6].wrapT = THREE.NoWrapping

	ktx[7].colorSpace = THREE.NoColorSpace
	ktx[7].wrapS = ktx[7].wrapT = THREE.NoWrapping

	ktx[8].colorSpace = THREE.NoColorSpace
	ktx[8].wrapS = ktx[8].wrapT = THREE.NoWrapping

	textures.set('line-copper-desktop', ktx[0])
	textures.set('line-gold-desktop', ktx[1])
	textures.set('line-copper-mobile', ktx[2])
	textures.set('line-gold-mobile', ktx[3])
	textures.set('mask', ktx[4])
	textures.set('line-copper-desktop-mask-draw', ktx[5])
	textures.set('line-gold-desktop-mask-draw', ktx[6])
	textures.set('line-copper-desktop-mask-beam', ktx[7])
	textures.set('line-gold-desktop-mask-beam', ktx[8])
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

function createDrag() {
	const points = itemsData.map(item => new THREE.Vector3().copy(item.position))
	curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6)

	// TODO: Hardcoded values for now, need to calculate them dynamically.
	const snaps = [980, 735, 490, 245, 0]
	const TOLERANCE = 10

	// Track the currently active snap point
	let currentSnapIndex = 0
	let valueOnPress = 0

	draggableInstance = Draggable.create(get(draggableDummyRef), {
		trigger: get(el),
		type: 'x',
		inertia: true,
		overshootTolerance: 0,
		throwResistance: 10000,
		edgeResistance: 1,
		dragResistance: 0.85,
		bounds: {
			left: 0,
			width: 1000,
		},
		zIndexBoost: false,
		onPress: () => {
			valueOnPress = draggableInstance[0].x
		},
		snap: value => {
			const distanceToCurrent = Math.abs(value - snaps[currentSnapIndex])

			// If within tolerance, snap to the current snap point (allows small drag movement)
			if (distanceToCurrent <= TOLERANCE) {
				return snaps[currentSnapIndex]
			}

			const direction = Math.sign(valueOnPress - value)
			currentSnapIndex = gsap.utils.clamp(
				0,
				snaps.length - 1,
				currentSnapIndex + direction
			)

			return snaps[currentSnapIndex]
		},
		onDrag: () => {
			update(draggableInstance[0].x)
		},
		onThrowUpdate: () => {
			update(draggableInstance[0].x)
		},
	})

	gsap.set(get(draggableDummyRef), {
		x: 980,
	})
	draggableInstance?.[0]?.update()
	draggableInstance?.[0]?.disable()

	let progressVector = new THREE.Vector3()

	function update(value) {
		dragProgress.value = value

		const normalizedValue = gsap.utils.mapRange(0, 980, 1, 0, value)
		curve.getPoint(normalizedValue, progressVector)

		controls.setLookAt(
			progressVector.x,
			progressVector.y,
			cameraZ,
			progressVector.x,
			progressVector.y,
			progressVector.z,
			false
		)
	}
}

function createCameraTargets() {
	targets.forEach(target => {
		scene.add(target)
	})
}

function createPostprocessing() {
	postProcessing = new THREE.PostProcessing(renderer)

	const scenePass = pass(scene, camera)
	const scenePassColor = scenePass.getTextureNode()

	const bloomPass = bloom(scenePassColor)
	bloomPass.strength = bloomStrength
	bloomPass.radius = bloomRadius
	bloomPass.threshold = bloomThreshold

	const compose = scenePassColor.add(bloomPass.mul(5))

	postProcessing.outputNode = compose
}

function createPanelPointerObserver() {
	//
	// Create an observer to handle the swipe up gesture on the panel.
	// When the user swipes up on the panel, we want to open it full.
	//
	panelPointerObserver = Observer.create({
		type: 'pointer,touch',
		target: get(panelRef),
		onChangeY: value => {
			if (value.target.dataset.openFull === 'true') return

			const curr = gsap.getProperty(get(panelRef), '--drag-pan-y')
			const newVal = Math.abs(curr) - value.deltaY
			gsap.set(get(panelRef), { '--drag-pan-y': newVal })
		},
		onRelease: () => {
			if (!isMobile) return

			// Prevent if the panel is not open.
			if (!get(panelOpen)) return

			// Prevent if the panel is fully opened.
			if (get(panelOpenFull)) return

			const curr = gsap.getProperty(get(panelRef), '--drag-pan-y')

			gsap.set(get(panelRef), { '--drag-pan-y': 0 })

			curr > 80 && openPanelFull()
		},
	})
}

async function handlePinPointerdown(event) {
	const { id: productId } = event.currentTarget.dataset

	draggableInstance?.[0]?.disable()

	const nicheIndex = Number(productId.split('_')[0])
	const params = {
		cover: false,
		paddingTop: get(isMobile) ? 0.15 : 0,
		paddingBottom: get(isMobile) ? 0.25 : 0,
		paddingRight: get(isMobile) ? 0 : 0.4,
		paddingLeft: get(isMobile) ? 0 : 0.1,
	}

	if (!get(isMobile)) {
		switch (nicheIndex) {
			case 1:
				params.paddingRight = 0.25
				params.paddingLeft = 0.02
				break
			case 2:
				params.paddingRight = 0.35
				params.paddingLeft = 0.05
				break
			case 3:
				params.paddingRight = 0.33
				params.paddingLeft = 0.05
				break
			case 4:
				params.paddingRight = 0.55
				params.paddingLeft = 0.15
				break
			default:
				break
		}
	}

	set(currentProduct, productId)
	set(currentProductData, get(panelsData).get(productId))

	const titleField = get(currentProductData).find(
		item => item.component === 'title'
	)
	Tracking.sendEvent({
		customizator_option: slugify(titleField.value.join(' ')),
		generic_event_and_label: 'product_click',
	})

	await nextTick()

	set(copyVisible, false)
	openPanel()

	controls.getPosition(controlsPositionMemo)

	controls.fitToBox(targets[nicheIndex], true, params)
}

async function openPanel() {
	set(panelOpen, true)
	set(pinsVisible, false)

	get(panelScrollerRef).scrollTo(0, 0)

	if (get(isMobile)) {
		get(panelScrollerRef).removeAttribute('data-lenis-prevent')
	} else {
		get(panelScrollerRef).dataset.lenisPrevent = ''
	}

	await nextTick()

	get(panelContentRef)
		.querySelectorAll('video')
		.forEach(video => {
			video.currentTime = 0
		})

	const tl = gsap.timeline({ delay: 0.55 })
	tl.addLabel('start')

	tl.fromTo(
		get(panelContentRef).children,
		{
			opacity: 0,
			y: 10,
		},
		{
			opacity: 1,
			y: 0,
			stagger: 0.1,
			duration: 1.2,
			ease: 'power2.out',
			overwrite: true,
		},
		'start'
	)

	tl.fromTo(
		get(closeButtonRef),
		{
			opacity: 0,
			rotation: -75,
		},
		{
			opacity: 1,
			rotation: 0,
			duration: 0.65,
			ease: 'power2.out',
			overwrite: true,
		},
		'start+=0.5'
	)
}

async function closePanel() {
	set(panelOpen, false)
	set(panelOpenFull, false)
	set(currentProduct, null)
	set(copyVisible, true)

	const currentPos = new THREE.Vector3()
	controls.getPosition(currentPos)

	get(panelContentRef)
		.querySelectorAll('video')
		.forEach(video => {
			video.pause()
		})

	await controls.setLookAt(
		controlsPositionMemo.x,
		controlsPositionMemo.y,
		controlsPositionMemo.z,
		controlsPositionMemo.x,
		controlsPositionMemo.y,
		controlsPositionMemo.z - 1,
		true
	)

	draggableInstance?.[0]?.enable()
	set(pinsVisible, true)
}

function openPanelFull() {
	get(panelScrollerRef).dataset.lenisPrevent = ''

	set(panelOpenFull, true)
}

async function introButtonOnCompleteCallback() {
	audioManager.init()

	await nextTick()

	uiStore.setAudioButtonVisible(true)
	appStore.setAudioEnabled(true)
	Howler.volume(1)

	!audioManager.getTrack(AUDIO_LABELS.BASE_LOOP).playing() &&
		audioManager.fadeIn(AUDIO_LABELS.BASE_LOOP)

	await animateOutIntro()

	set(css3DContentVisible, true)

	await animateToInitialPosition()

	set(copyVisible, true)

	gsap.delayedCall(0.5, () => {
		set(pinsVisible, true)
	})
}

function animateInBackground() {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.to(
		backgroundCopper.drawProgress,
		{
			value: 1,
			duration: 5,
		},
		'start'
	)

	tl.to(
		backgroundGold.drawProgress,
		{
			value: 1,
			duration: 5,
		},
		'start'
	)

	tl.to(
		bloomStrength,
		{
			value: 0,
			duration: 2,
			ease: 'power2.out',
		},
		'>-1'
	)

	tl.to(
		[backgroundCopper.mapVisibility, backgroundGold.mapVisibility],
		{
			value: 1,
			duration: 1.2,
		},
		'<'
	)

	tl.to(
		[get(logoRef).$el, get(introTextRef)],
		{
			'--color-shadow-start-influence': '0%',
			duration: 2,
			ease: 'power2.out',
		},
		'<'
	)

	tl.to(
		[get(logoRef).$el, get(introTextRef)],
		{
			'--color-shadow-end-influence': '100%',
			duration: 2,
			ease: 'power2.out',
		},
		'<0.4'
	)

	tl.to(
		[backgroundCopper.thickness, backgroundGold.thickness],
		{
			value: 1,
			duration: 2,
		},
		'<'
	)
}

function animateInIntro() {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	introSplit.lines.forEach(line => {
		tl.to(
			line.querySelectorAll('.char'),
			{
				opacity: 1,
				duration: 1,
				stagger: {
					amount: 1.8,
				},
			},
			'start'
		)
	})

	tl.to(
		[get(logoRef).$el, get(introTextRef), get(introButtonRef).$el],
		{
			autoAlpha: 1,
			duration: 1.4,
			stagger: 0.1,
		},
		'>-0.7'
	)

	return tl.play()
}

function animateOutIntro() {
	return gsap.to(
		[get(logoRef).$el, get(introTextRef), get(introButtonRef).$el],
		{
			autoAlpha: 0,
			duration: 0.75,
			stagger: -0.2,
			onStart: () => {
				gsap.set(get(introButtonRef).$el, { pointerEvents: 'none' })
			},
		}
	)
}

function animateInInstructions() {
	gsap.to(instructionsSplit.chars, {
		opacity: 1,
		duration: 1,
		stagger: 0.04,
	})
}

function animateOutInstructions() {
	gsap
		.to(instructionsSplit.chars, {
			opacity: 0,
			duration: 1,
			stagger: 0.04,
			overwrite: true,
		})
		.timeScale(1.5)
}

async function animateToInitialPosition() {
	controls.smoothTime = 0.5

	await controls.fitToBox(targets[0], true, {
		cover: false,
		paddingTop: 0.25,
		paddingBottom: 0.25,
	})

	const currentPos = new THREE.Vector3()
	controls.getPosition(currentPos)
	cameraZ = currentPos.z

	controls.smoothTime = 0.25
	draggableInstance?.[0]?.enable()

	animateInInstructions()

	get(canvasRef).addEventListener(
		'pointerdown',
		() => {
			animateOutInstructions()
		},
		{ once: true }
	)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.explore {
	@apply grid h-[100svh] overflow-hidden select-none;
	@apply transition-opacity duration-1000;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	background-color: #1b0b08;

	> * {
		@apply col-start-1 row-start-1 size-full;
	}
}

.top-gradient {
	@apply relative z-[1] pointer-events-none;
	@apply transition-opacity duration-1000;

	background: linear-gradient(
		to bottom in oklch,
		oklch(17.3% 0.029 31.97 / 100%) 30%,
		oklch(17.3% 0.029 31.97 / 0%)
	);
	height: toRem(150);

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.explore-content {
	@apply pointer-events-none relative size-full top-0 left-0;
	@apply transition-opacity duration-1000;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	top: env(safe-area-inset-top, 0);
	left: env(safe-area-inset-left, 0);
}

:deep(.socket) {
	@apply grid text-gold text-center uppercase relative;

	height: var(--h);
	width: var(--w);
	transform-origin: center center;

	> * {
		@apply col-start-1 row-start-1;
	}

	.pic {
		@apply justify-self-center block overflow-hidden;

		height: var(--h);
		width: var(--w);
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

		&:not(:has([data-current='true'])) .pin:hover + .pic,
		.pic[data-current='true'] {
			@apply opacity-100;
		}

		.pic[data-current='false'] {
			@apply delay-75;
		}
	}

	:is(.year, .title, .copy) {
		@apply self-center pointer-events-none whitespace-nowrap;
		@apply transition-opacity duration-700 opacity-0;

		.explore[data-text-visible='true'] & {
			@apply opacity-100;
		}
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
		@apply size-12 relative z-[1] cursor-pointer pointer-events-auto;
		@apply transition-opacity duration-700;

		.explore[data-pins-visible='false'] & {
			@apply opacity-0 pointer-events-none;
		}

		translate: calc(var(--x) * var(--w) - 50%) calc(var(--y) * var(--h) - 50%);
	}

	&[data-id='0'] {
		.year {
			translate: 0 calc(var(--h) * -0.9);
		}

		.title {
			translate: 0 calc(var(--h) * -0.7);
		}

		.copy {
			translate: 0 calc(var(--h) * 0.67);
		}
	}

	&[data-id='1'] {
		.year {
			translate: 0 calc(var(--h) * 0.9);
		}

		.title {
			translate: 0 calc(var(--h) * 1.35);
		}

		.copy {
			translate: 0 calc(var(--h) * -0.88);
		}
	}

	&[data-id='2'] {
		.year {
			translate: 0 calc(var(--h) * -1);
		}

		.title {
			translate: 0 calc(var(--h) * -0.75);
		}

		.copy {
			translate: 0 calc(var(--h) * 0.67);
		}
	}

	&[data-id='3'] {
		.year {
			translate: 0 calc(var(--h) * 0.83);
		}

		.title {
			translate: 0 calc(var(--h) * 1.23);
		}

		.copy {
			translate: 0 calc(var(--h) * -0.92);
		}
	}

	&[data-id='4'] {
		.year {
			translate: 0 calc(var(--h) * -0.95);
		}

		.title {
			translate: 0 calc(var(--h) * -0.67);
		}
	}
}

.panel {
	--drag-pan-y: 0;
	--height-on-open: 250;

	@apply relative z-[1] select-none;
	@apply flex flex-col items-stretch gap-y-5 bg-[hsl(22,43%,22%)] text-gold rounded-t-[10px] pt-5 px-5 pb-8;
	@apply border border-solid border-[#75482E];

	&::after {
		@apply block content-[''] absolute bottom-12 inset-x-0 h-16 pointer-events-none;
		@apply md:bottom-8;

		--hdr-gradient: linear-gradient(
			to top in oklab,
			oklch(35% 0.05 50) 10%,
			oklch(90% 0.5 200 / 0%)
		);

		background: var(--hdr-gradient);
	}

	@screen md-down {
		@apply self-end justify-self-center pb-14;

		height: calc(var(--height-on-open) * 1px);
		transition-property: transform, height;
		transition-timing-function: theme('transitionTimingFunction.out'),
			theme('transitionTimingFunction.out');
		transition-duration: 700ms, 500ms;
		width: min(100%, toRem(400));

		&[data-open='false'] {
			@apply translate-y-full;

			transition-duration: 400ms;
		}

		&[data-open='true'][data-open-full='false'] {
			height: calc((var(--height-on-open) + var(--drag-pan-y)) * 1px);
		}

		&[data-open-full='true'] {
			height: min(toRem(500), calc(100svh - 80px));
		}
	}

	@screen md {
		@apply h-auto rounded-b-[10px] right-9 justify-self-end self-center;
		@apply transition-opacity duration-[800ms] delay-300;

		max-height: min(toRem(600), calc(100svh - toRem(280)));
		width: min(toRem(375), 50vw);

		&[data-open='false'] {
			@apply self-center opacity-0 pointer-events-none delay-0 duration-500;
		}

		&[data-can-scroll='false']::after {
			@apply hidden;
		}
	}

	@screen lg {
		width: min(toRem(425), 50vw);
	}

	@screen 2xl {
		right: 15vw;
	}
}

.panel-scroller {
	timeline-scope: --scroll;
	animation: --scroll forwards;
	animation-timeline: --scroll;
	container-name: --scroll;
}

.panel-close-button {
	@apply absolute z-[1] top-4 right-4;

	width: toRem(14);

	&::after {
		@apply content-[''] absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 bg-transparent;
	}
}

.panel-content {
	@apply flex flex-col gap-y-7 relative;
	@apply md-down:pb-10;

	@screen md {
		[data-can-scroll='true'] & {
			@apply pb-14;
		}
	}
}

.panel-content-header {
	@apply tracking-[0.05em] font-medium leading-none flex flex-col items-start;

	font-size: toRem(20);
	width: calc(100% - toRem(32));

	@screen tablet-portrait-lg {
		font-size: toRem(26);
	}
}

.panel-content-title {
	@apply uppercase;
}

.panel-content-copy {
	@apply tracking-[0.05em] font-medium leading-[1.3333];

	font-size: toRem(15);

	@screen tablet-portrait-lg {
		font-size: toRem(20);
	}
}

.panel-content-cta {
	@apply self-center;
}

.panel-content-image {
	@apply overflow-hidden w-40 self-center;

	:deep(img) {
		@apply size-full object-contain object-center;
	}
}

.panel-content-video {
	@apply overflow-hidden w-full rounded-[20px];

	:deep(video) {
		@apply size-full object-contain object-center;
	}
}

.logo {
	@apply text-gold relative z-[1] pointer-events-none justify-self-center self-start h-auto;
	@apply transition-transform duration-500;

	translate: 0 max(toRem(128), 15svh);
	width: toRem(150);
}

.intro {
	@apply flex flex-col gap-y-20 items-center size-auto self-end justify-self-center text-center relative z-[1] pointer-events-none select-none text-gold;

	translate: 0 min(toRem(-66), -10svh);
}

.intro-text {
	@apply text-base leading-tight tracking-[0.05em] whitespace-nowrap;
}

.instructions {
	@apply size-auto self-end justify-self-center pointer-events-none text-gold relative z-[1] select-none whitespace-nowrap;
	@apply leading-none tracking-[0.03em];

	font-size: toRem(15);
	translate: 0 min(toRem(-100), -15svh);
}

.multi-shadow {
	--color-shadow-start: #000000;
	--color-shadow-start-influence: 100%;
	--color-shadow-end: #1b0b08;
	--color-shadow-end-influence: 0%;

	--color-shadow: color-mix(
		in oklab,
		var(--color-shadow-start) var(--color-shadow-start-influence),
		var(--color-shadow-end) var(--color-shadow-end-influence)
	);

	filter: drop-shadow(0 0 5px var(--color-shadow))
		drop-shadow(0 0 12px var(--color-shadow))
		drop-shadow(0 0 14px var(--color-shadow))
		drop-shadow(0 0 18px var(--color-shadow))
		drop-shadow(0 0 22px var(--color-shadow));
}
</style>
