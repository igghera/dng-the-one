<template>
	<Container class="pointer-events-none">
		<header
			class="header | text-shadow"
			style="opacity: 0.0001"
			ref="introHeaderRef"
		>
			<h2 class="flex flex-col gap-y-2 lg:gap-y-7 text-center items-stretch">
				<span
					class="body-8 | text-gold-light whitespace-nowrap"
					v-html="$t('experience_end.intro_title[0]')"
					ref="title01Ref"
				/>
				<span
					class="display-1-alt | golden-text | uppercase font-medium"
					v-html="$t('experience_end.intro_title[1]')"
					ref="title02Ref"
				/>
			</h2>
		</header>

		<button class="btn" style="opacity: 0; visibility: hidden" ref="buttonRef">
			<svg
				class="w-14 md:w-16"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 58 58"
				overflow="visible"
			>
				<g ref="backgroundCircleWrapperRef">
					<circle
						class="stroke-gold"
						cx="29"
						cy="29"
						r="28.5"
						stroke-opacity=".3"
					/>
				</g>

				<g ref="fillingCircleWrapperRef">
					<circle
						class="stroke-gold"
						cx="29"
						cy="29"
						r="28.5"
						stroke-opacity=".7"
						ref="fillingCircleRef"
					/>
				</g>
			</svg>

			<span
				class="text-base leading-none font-medium tracking-[0.03em] text-gold-light | text-shadow"
				ref="ctaLabelRef"
				>{{ $t('experience_end.cta') }}</span
			>
		</button>

		<Transition name="fade">
			<div v-if="showResult && appStore.getResult" class="result">
				<span class="result-pre-title">
					{{ $t('experience_end.title') }}
				</span>

				<span class="result-title | golden-text">
					{{ appStore.getResult.get('auraFull').title }}
				</span>

				<span class="result-copy">
					{{
						appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
							.desc
					}}
				</span>
			</div>
		</Transition>

		<Transition name="fade-long">
			<nav v-if="shouldShowButtons" class="buttons">
				<div class="buttons-row">
					<template v-if="config.public.isAppMode">
						<ButtonGolden
							v-if="config.public.isAppMode && canPrint"
							class="!text-gold"
							@click="handlePrint"
							>{{ $t('results.cta_print') }}</ButtonGolden
						>

						<ButtonGolden
							:size="canPrint ? 'auto' : 'wide'"
							class="!text-gold"
							@click="handleQRCodeButtonClick"
							>{{ $t('download') }}</ButtonGolden
						>
					</template>

					<template v-else>
						<ButtonRestart class="!text-gold" />

						<ButtonGolden
							class="!text-gold"
							@click="handleDownloadButtonClick"
							>{{ $t('results.cta_download') }}</ButtonGolden
						>
					</template>
				</div>

				<div v-if="config.public.isAppMode" class="buttons-row">
					<button
						class="body-3-alt | flex gap-x-2 items-center justify-center text-gold underline"
						@click="handleRestartButtonClick"
					>
						<IconRestart class="size-[0.8rem]" />

						<span>{{ $t('results.cta_restart') }}</span>
					</button>
				</div>
			</nav>
		</Transition>
	</Container>
</template>

<script setup>
import { computed } from 'vue'
import { get, set, useStorage } from '@vueuse/core'
import { Printer } from '@bcyesil/capacitor-plugin-printer'
import { PDFDocument } from 'pdf-lib'
import { ZeroConf } from 'capacitor-zeroconf'
import { snapdom } from '@zumer/snapdom'
import { cropTransparentPixels } from '~/assets/js/cropTransparentPixels'

import {
	progress as maskProgress,
	borderWidth as maskBorderWidth,
} from '~/components/Experience/WebGL/materials/mask'

import { opacity as starsOpacity } from '~/components/Experience/WebGL/materials/stars'

import { experienceEndDrawMaterial } from '~/components/Experience/WebGL/materials'

//
// Refs / State
//
const config = useRuntimeConfig()

const lenis = useLenis()

const introHeaderRef = useTemplateRef('introHeaderRef')
const title01Ref = useTemplateRef('title01Ref')
const title02Ref = useTemplateRef('title02Ref')
const buttonRef = useTemplateRef('buttonRef')
const backgroundCircleWrapperRef = useTemplateRef('backgroundCircleWrapperRef')
const fillingCircleWrapperRef = useTemplateRef('fillingCircleWrapperRef')
const fillingCircleRef = useTemplateRef('fillingCircleRef')
const ctaLabelRef = useTemplateRef('ctaLabelRef')

const canInteract = shallowRef(true)

// TODO: Set this value in the app store / local storage
const canPrint = shallowRef(true)

const printers = shallowRef([])
const printerDiscoveryError = shallowRef(null)
const isPrinterDiscoveryActive = shallowRef(false)

const { rt, tm } = useI18n()
const { gsap, Observer, SplitText } = useGSAP()

const appStore = useAppStore()
const uiStore = useUiStore()

const { height: windowHeight } = useWindowSize()

const urlParams = useUrlSearchParams('history')
const isFromExplore = urlParams.ref === 'explore'
const storage = useStorage('experience-answers', {})

const showResult = shallowRef(false)

const MM_PER_INCH = 25.4
const PHOTO_WIDTH_MM = 102
const PHOTO_HEIGHT_MM = 150
const BASE_DPI = 300
const CANVAS_DIMENSIONS = Object.freeze({
	width: Math.round((PHOTO_WIDTH_MM / MM_PER_INCH) * BASE_DPI),
	height: Math.round((PHOTO_HEIGHT_MM / MM_PER_INCH) * BASE_DPI),
})

const ZERO_CONF_DOMAIN = 'local.'
const ZERO_CONF_SERVICE_TYPES = [
	'_ipp._tcp',
	'_printer._tcp',
	'_pdl-datastream._tcp',
	'_riousbprint._tcp',
	'_print-caps._tcp',
]

const watchedServiceTypes = new Set()
const isClient = typeof window !== 'undefined'
const desiredPrinterName =
	config.public.printerName ?? 'none'

const selectedPrinter = computed(() => get(printers)[0] ?? null)

const allAurasFull = Object.values(tm('auras')).map(aura => ({
	title: rt(aura.title),
	male: {
		desc: rt(aura.male.desc),
		fragrance: {
			title: rt(aura.male.fragrance.title),
			sub_title: rt(aura.male.fragrance.sub_title),
			desc: rt(aura.male.fragrance.desc),
		},
	},
	female: {
		desc: rt(aura.female.desc),
		fragrance: {
			title: rt(aura.female.fragrance.title),
			sub_title: rt(aura.female.fragrance.sub_title),
			desc: rt(aura.female.fragrance.desc),
		},
	},
}))

const allAuras = Object.values(tm('experience_end.options')).map(option => ({
	title: rt(option.title),
	copy: rt(option.copy),
}))

const allProducts = Object.values(tm('products')).map(product => ({
	title: rt(product.title),
	sub_title: rt(product.sub_title),
	copy: rt(product.copy),
}))

let drawTimeline, pointerObserver

//
// Computed
//
const shouldShowButtons = computed(() => {
	if (get(windowHeight) > 1000) {
		return get(showResult) && appStore.getResult
	} else {
		return (
			get(showResult) &&
			appStore.getResult &&
			!uiStore.isResultsScrollDownVisible
		)
	}
})

//
// Lifecycle
//
onMounted(async () => {
	if (config.public.isAppMode) {
		startPrinterDiscovery()
	}

	setInitialState()

	if (isFromExplore) {
		appStore.setStep01Selection(get(storage).q1)
		appStore.setStep02Selection(get(storage).q2)
		appStore.setStep03Selection(get(storage).q3)
	} else {
		await animateInHeader()
	}

	const res = calculateResult(
		appStore.getStep01Selection,
		appStore.getStep02Selection,
		appStore.getStep03Selection,
		allAuras,
		allProducts,
		allAurasFull
	)

	appStore.setResult(res.result)

	if (isFromExplore) {
		uiStore.setResultsVisible(true)
		set(showResult, true)
	}

	experienceEndDrawMaterial.mapIndex.value =
		res.result.get('shape') === 'male' ? 0 : 1

	if (!uiStore.isExperienceEndVisible) return

	await gsap.delayedCall(0.5, () => {})

	if (isFromExplore) {
		// Do Nothing
		experienceEndDrawMaterial.progress.value = 1
	} else {
		animateOutHeader()

		emitter.emit(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_START)

		createButtonTimeline()
	}
})

onBeforeUnmount(() => {
	drawTimeline?.kill()
	pointerObserver?.kill()

	stopPrinterDiscovery()

	emitter.removeListener(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_COMPLETE)
})

//
// Events
//
emitter.on(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_COMPLETE, async () => {
	await animateInButton()

	createPointerObserver()
})

//
// Methods
//
const setInitialState = () => {
	gsap.set(get(introHeaderRef), { autoAlpha: 0 })
}

const CM_TO_POINTS = 72 / 2.54
const PHOTO_PAPER = Object.freeze({
	width: 10.2 * CM_TO_POINTS,
	height: 15 * CM_TO_POINTS,
})

const ZERO_MARGINS = Object.freeze({
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
})

const BORDERLESS_OPTIONS = {
	printType: 'photo',
	ui: {
		hidePaperFormat: true, // Potentially hide paper format selection
		hideBorder: true, // Specifically request borderless
	},
}

const dataUrlToBytes = dataUrl => {
	const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
	if (!match) throw new Error('Invalid data URL format')

	const [, mime, base64] = match
	const binary = atob(base64)
	const bytes = new Uint8Array(binary.length)

	for (let i = 0; i < binary.length; i += 1) {
		bytes[i] = binary.charCodeAt(i)
	}

	return { mime, bytes }
}

const createPhotoPrintPdf = async dataUrl => {
	const pdfDoc = await PDFDocument.create()
	const { mime, bytes } = dataUrlToBytes(dataUrl)
	const embedImage = mime.includes('png')
		? await pdfDoc.embedPng(bytes)
		: await pdfDoc.embedJpg(bytes)

	const page = pdfDoc.addPage([PHOTO_PAPER.width, PHOTO_PAPER.height])
	const scale = Math.min(
		page.getWidth() / embedImage.width,
		page.getHeight() / embedImage.height
	)

	const drawWidth = embedImage.width * scale
	const drawHeight = embedImage.height * scale

	page.drawImage(embedImage, {
		x: (page.getWidth() - drawWidth) / 2,
		y: (page.getHeight() - drawHeight) / 2,
		width: drawWidth,
		height: drawHeight,
	})

	const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })

	return `base64:${pdfDataUri}`
}

const buildPhotoReadyDataUrl = blob =>
	new Promise((resolve, reject) => {
		if (!blob) {
			reject(new Error('Screenshot blob is missing'))
			return
		}

		const objectUrl = URL.createObjectURL(blob)
		const image = new Image()

		image.onload = () => {
			const canvas = document.createElement('canvas')
			canvas.width = CANVAS_DIMENSIONS.width
			canvas.height = CANVAS_DIMENSIONS.height

			const ctx = canvas.getContext('2d')
			if (!ctx) {
				URL.revokeObjectURL(objectUrl)
				reject(new Error('Unable to obtain canvas context'))
				return
			}

			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const scale = Math.max(
				canvas.width / image.width,
				canvas.height / image.height
			)

			const drawWidth = image.width * scale
			const drawHeight = image.height * scale
			const offsetX = (canvas.width - drawWidth) / 2
			const offsetY = (canvas.height - drawHeight) / 2

			ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
			URL.revokeObjectURL(objectUrl)
			resolve(canvas.toDataURL('image/png'))
		}

		image.onerror = error => {
			URL.revokeObjectURL(objectUrl)
			reject(error)
		}

		image.src = objectUrl
	})

const buildBase64Payload = dataUrl => {
	const [, payload] = dataUrl.split(',')
	if (!payload) throw new Error('Invalid photo data URL')
	return `base64://${payload}`
}

const upsertPrinterFromService = service => {
	if (!service?.name) return

	const printerName = service.name
	if (
		desiredPrinterName &&
		!printerName.toLowerCase().includes(desiredPrinterName.toLowerCase())
	)
		return

	const deviceAddress =
		service.ipv4Addresses?.[0] ??
		service.ipv6Addresses?.[0] ??
		service.hostname ??
		''

	if (!deviceAddress) return

	const port = service.port || 631
	const nextPrinter = {
		name: printerName,
		ip: deviceAddress,
		ippUrl: `ipp://${deviceAddress}:${port}/ipp/print`,
	}

	const currentPrinters = get(printers)
	const exists = currentPrinters.some(
		printer =>
			printer.ip === nextPrinter.ip && printer.name === nextPrinter.name
	)

	if (!exists) {
		set(printers, [...currentPrinters, nextPrinter])
	}
}

const formatZeroConfError = (type, error) => {
	const code = error?.code ?? error?.message

	if (code === -72008) {
		return 'Network permission denied for printer discovery'
	}

	return `ZeroConf watch error (${type}): ${error?.message ?? error}`
}

const startPrinterDiscovery = async () => {
	if (!isClient || !config.public.isAppMode || get(isPrinterDiscoveryActive)) {
		return false
	}

	set(printerDiscoveryError, null)

	let hasActiveWatchers = false
	await Promise.all(
		ZERO_CONF_SERVICE_TYPES.map(async type => {
			try {
				await ZeroConf.watch(
					{ type, domain: ZERO_CONF_DOMAIN },
					result => {
						if (result?.service) {
							console.log('Discovered printer service:', result.service)
							
							upsertPrinterFromService(result.service)
						}
					}
				)
				watchedServiceTypes.add(type)
				hasActiveWatchers = true
			} catch (error) {
				console.error(`[ZeroConf] Failed to watch ${type}`, error)
				set(printerDiscoveryError, formatZeroConfError(type, error))
			}
		})
	)

	set(isPrinterDiscoveryActive, hasActiveWatchers)
	return hasActiveWatchers
}

const stopPrinterDiscovery = async () => {
	if (!watchedServiceTypes.size) return

	await Promise.all(
		Array.from(watchedServiceTypes).map(async type => {
			try {
				await ZeroConf.unwatch({ type, domain: ZERO_CONF_DOMAIN })
			} catch (error) {
				console.warn(`[ZeroConf] Failed to unwatch ${type}`, error)
			}
		})
	)

	watchedServiceTypes.clear()
	set(isPrinterDiscoveryActive, false)
}

const tryDirectPrinterJob = async payload => {
	if (!isClient) return false

	const printerPlugin = window?.cordova?.plugins?.printer
	const printerTarget = get(selectedPrinter)

	if (!printerPlugin || !printerTarget) {
		return false
	}

	return new Promise((resolve, reject) => {
		let resolved = false
		const complete = success => {
			if (resolved) return
			resolved = true
			resolve(success)
		}

		try {
			printerPlugin.print(
				payload,
				{
					printer: printerTarget.ippUrl,
					margin: ZERO_MARGINS,
				},
				() => complete(true)
			)

			setTimeout(() => complete(true), 300)
		} catch (error) {
			reject(error)
		}
	})
}

const handlePrint = async () => {
	const printName = `the-one-card-${Date.now()}`

	try {
		const blob = await takeScreenshot(false)

		if (!blob) throw new Error('Failed to capture screenshot blob')

		const dataUrl = await buildPhotoReadyDataUrl(blob)
		console.log('Screenshot captured, dataUrl prefix:', dataUrl.substring(0, 50))

		const base64ImagePayload = buildBase64Payload(dataUrl)
		console.log('Base64 Payload prefix:', base64ImagePayload.substring(0, 50))

		let printedDirectly = false

		try {
			console.log('Attempting direct print...')
			if (!isClient) throw new Error('Not client side')

			// Use cordova.plugins.printer directly if available (bypass capacitor wrapper)
			const printerPlugin = window?.cordova?.plugins?.printer
			const printerTarget = get(selectedPrinter)
			
			if (!printerPlugin) throw new Error('Cordova printer plugin not found')
			if (!printerTarget) throw new Error('No printer selected')

			console.log('Printing to target:', printerTarget.ippUrl)
			
			printedDirectly = await new Promise((resolve, reject) => {
				let resolved = false
				const complete = success => {
					if (resolved) return
					resolved = true
					resolve(success)
				}

				try {
					printerPlugin.print(
						base64ImagePayload,
						{
							printer: printerTarget.ippUrl,
							margin: ZERO_MARGINS,
							...BORDERLESS_OPTIONS,
						},
						() => complete(true)
					)

					setTimeout(() => complete(true), 1000) // Increased timeout
				} catch (error) {
					reject(error)
				}
			})
			
			console.log('Direct print result:', printedDirectly)
		} catch (directError) {
			console.error('Direct network print failed:', directError)
			alert(rt('experience_end.print_error') ?? 'Unable to print directly to ' + (get(selectedPrinter)?.name || 'printer'))
		}
	} catch (error) {
		console.error('handlePrint failed:', error)
		alert(rt('experience_end.print_error') ?? 'Unable to start print job')
	}
}

const handleQRCodeButtonClick = () => {
	uiStore.setQrCodeModalVisible(true)
}

const handleDownloadButtonClick = async () => {
	downloadImage('/mock-download-card.png', 'the-one-card.png')

	return

	takeScreenshot(true)
}

const handleRestartButtonClick = async () => {
	if (isFromExplore) {
		await navigateTo('/')
		emitter.emit(EVENTS.RESTART)
	} else {
		emitter.emit(EVENTS.RESTART)
	}
}

const createButtonTimeline = () => {
	drawTimeline = gsap.timeline({
		paused: true,
		onComplete: async () => {
			set(canInteract, false)

			await gsap.to([get(ctaLabelRef), get(buttonRef)], {
				autoAlpha: 0,
				stagger: 0.2,
				duration: 0.4,
			})

			animateMask()
		},
	})
	drawTimeline.addLabel('start')

	drawTimeline.fromTo(
		[get(backgroundCircleWrapperRef), get(fillingCircleWrapperRef)],
		{
			scale: 1,
			transformOrigin: 'center center',
			rotation: -90,
		},
		{
			scale: 1.7,
			duration: 1,
			ease: 'none',
		},
		'start'
	)

	drawTimeline.fromTo(
		get(fillingCircleRef),
		{
			drawSVG: '0% 0%',
		},
		{
			drawSVG: '0% 100%',
			duration: 1,
			ease: 'none',
		},
		'start'
	)
}

const createPointerObserver = () => {
	pointerObserver = Observer.create({
		target: get(buttonRef),
		onPress: () => {
			if (!get(canInteract)) return

			gsap.to(drawTimeline, {
				progress: 1,
				duration: 1.4,
				ease: 'power2.out',
				overwrite: true,
			})
		},
		onRelease: () => {
			if (!get(canInteract)) return

			gsap.to(drawTimeline, {
				progress: 0,
				duration: 1,
				ease: 'circ.out',
				overwrite: true,
			})
		},
	})
}

const animateInHeader = () => {
	const split01 = SplitText.create(get(title01Ref), {
		type: 'lines,words,chars',
	})

	gsap.set(get(introHeaderRef), { autoAlpha: 1 })

	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.fromTo(
		split01.chars,
		{ opacity: 0 },
		{ opacity: 1, duration: 1, stagger: 0.1 },
		'start'
	)

	tl.fromTo(get(title02Ref), { opacity: 0 }, { opacity: 1, duration: 1.5 }, '>')

	return tl.play()
}

const animateOutHeader = () => {
	gsap.to(get(introHeaderRef), {
		autoAlpha: 0,
		duration: 0.5,
		ease: 'power1.out',
	})
}

const animateInButton = () => {
	return gsap.fromTo(
		get(buttonRef),
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 0.5,
		}
	)
}

const takeScreenshot = async (download = true) => {
	const canvasElem = document.getElementById('experience-canvas')
	const canvas = await snapdom.toCanvas(canvasElem, { scale: 2 })

	const domElem = document.getElementById('experience-end')
	const dom = await snapdom.toCanvas(domElem, {
		scale: 2,
		filter: el => {
			return el.tagName !== 'BUTTON'
		},
	})

	// Create a combined canvas that can accommodate both screenshots
	const combinedWidth = Math.max(canvas.width, dom.width)
	const combinedHeight = Math.max(canvas.height, dom.height)
	const combinedCanvas = document.createElement('canvas')
	combinedCanvas.width = combinedWidth
	combinedCanvas.height = combinedHeight

	const ctx = combinedCanvas.getContext('2d')

	// Draw the canvas screenshot first (background)
	ctx.drawImage(canvas, 0, 0)

	// Draw the DOM screenshot on top (overlay)
	// Center the DOM canvas if sizes differ, or draw at 0,0 if same size
	const domX = (combinedWidth - dom.width) / 2
	const domY = (combinedHeight - dom.height) / 2 + 30
	ctx.drawImage(dom, domX, domY)

	// Apply cropTransparentPixels to the combined result
	const filename = `the-one-card-${Date.now()}`

	const result = cropTransparentPixels(
		combinedCanvas,
		{
			padding: 4,
			inset: 20,
			filename,
		},
		download
	)

	return result
}

const animateMask = () => {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.fromTo(
		maskProgress,
		{
			value: 0,
		},
		{
			value: 0.9,
			duration: 1.1,
			ease: 'circ.out',
		},
		'start'
	)

	tl.fromTo(
		maskBorderWidth,
		{
			value: 0,
		},
		{
			value: 0.01,
			duration: 0.8,
		},
		'<0.3'
	)

	tl.fromTo(
		starsOpacity,
		{
			value: 0,
		},
		{
			value: 1,
			duration: 0.7,
		},
		'<0.3'
	)

	tl.call(
		() => {
			emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)
			set(showResult, true)
		},
		null,
		'>-0.05'
	)

	tl.call(
		async () => {
			uiStore.setResultsVisible(true)
			await nextTick()
			get(lenis).start()
		},
		null,
		'>0.4'
	)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;
}

.header {
	@apply self-start col-start-1 row-start-1;
	@apply portrait:translate-y-full;
	@apply landscape:translate-y-1/2;
}

.btn {
	@apply col-start-1 row-start-1 self-center grid items-center justify-items-center text-center pointer-events-auto *:pointer-events-none *:col-start-1 *:row-start-1;

	-webkit-touch-callout: none; /* Disable context menu */
}

.result {
	@apply flex flex-col items-center text-center col-start-1 row-start-1 self-center;

	row-gap: toRem(11);
	width: toRem(170);

	@screen md {
		width: toRem(230);
	}
}

.result-pre-title {
	@apply uppercase font-normal leading-[1.7] tracking-[0.13em] text-gold-light;

	font-size: toRem(17);
}

.result-title {
	@apply font-normal uppercase leading-none;

	font-size: toRem(36);
}

.result-copy {
	@apply font-normal leading-[1.5] tracking-[0.04em] text-gold-light;

	font-size: toRem(10);
}

.buttons {
	@apply col-start-1 row-start-1 grid grid-cols-1 gap-6 items-center justify-center self-end;

	translate: 0 toRem(80);

	:deep(> *) {
		@apply pointer-events-auto;
	}
}

.buttons-row {
	@apply flex gap-5 items-center justify-center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-long-enter-active {
	transition: opacity 0.7s ease;
}

.fade-long-leave-active {
	transition: opacity 0.4s ease;
}

.fade-long-enter-from,
.fade-long-leave-to {
	opacity: 0;
}
</style>
