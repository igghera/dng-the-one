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
			<nav
				v-if="shouldShowButtons && !uiStore.isResultsScrollDownVisible"
				class="buttons"
			>
				<div class="buttons-row">
					<template v-if="config.public.isAppMode">
						<ButtonGolden
							v-if="config.public.isAppMode && printEnabled"
							class="!text-gold"
							@click="handlePrint"
							>{{ $t('results.cta_print') }}</ButtonGolden
						>

						<ButtonGolden
							:size="printEnabled ? 'auto' : 'wide'"
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
import { Howler } from 'howler'
import { get, set, useStorage } from '@vueuse/core'
// import { PDFDocument } from 'pdf-lib'
import { ZeroConf } from 'capacitor-zeroconf'
import { snapdom } from '@zumer/snapdom'
import { cropTransparentPixels } from '~/assets/js/cropTransparentPixels'

import {
	progress as maskProgress,
	borderWidth as maskBorderWidth,
} from '~/components/Experience/WebGL/materials/mask'

import { experienceEndDrawMaterial } from '~/components/Experience/WebGL/materials'

//
// Refs / State
//
const config = useRuntimeConfig()

const lenis = useLenis()

const el = useCurrentElement()
const introHeaderRef = useTemplateRef('introHeaderRef')
const title01Ref = useTemplateRef('title01Ref')
const title02Ref = useTemplateRef('title02Ref')
const buttonRef = useTemplateRef('buttonRef')
const backgroundCircleWrapperRef = useTemplateRef('backgroundCircleWrapperRef')
const fillingCircleWrapperRef = useTemplateRef('fillingCircleWrapperRef')
const fillingCircleRef = useTemplateRef('fillingCircleRef')
const ctaLabelRef = useTemplateRef('ctaLabelRef')

const canInteract = shallowRef(true)

const printers = shallowRef([])
const printerDiscoveryError = shallowRef(null)
const isPrinterDiscoveryActive = shallowRef(false)

const { rt, tm } = useI18n()
const { gsap, Observer, SplitText } = useGSAP()

const appStore = useAppStore()
const uiStore = useUiStore()
const trackingStore = useTrackingStore()

const { height: windowHeight } = useWindowSize()

const urlParams = useUrlSearchParams('history')
const isFromExplore = urlParams.ref === 'explore'

const printEnabled = useStorage(STORAGE_LABELS.PRINT_ENABLED, false)
const storage = useStorage('experience-answers', {})

const showResult = shallowRef(false)

const MM_PER_INCH = 25.4
// Standard 4x6 inch dimensions
const PHOTO_WIDTH_INCH = 4
const PHOTO_HEIGHT_INCH = 6
const BASE_DPI = 300

// Exact 4x6 inch at 300 DPI (1200x1800)
const CANVAS_DIMENSIONS = Object.freeze({
	width: PHOTO_WIDTH_INCH * BASE_DPI,
	height: PHOTO_HEIGHT_INCH * BASE_DPI,
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
const desiredPrinterName = config.public.printerName ?? 'none'

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

emitter.once(EVENTS.BACK, () => {
	if (!uiStore.isExperienceEndVisible) return

	back()
})

//
// Methods
//
const setInitialState = () => {
	gsap.set(get(introHeaderRef), { autoAlpha: 0 })
}

const back = async () => {
	uiStore.setBackButtonVisible(false)

	pointerObserver?.kill()

	await animateBack()

	uiStore.setExperienceStep03Visible(true)
}

const animateBack = async () => {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.to(
		get(el),
		{
			autoAlpha: 0,
			duration: 0.8,
		},
		'start'
	)

	tl.to(
		experienceEndDrawMaterial.opacity,
		{
			value: 0,
			duration: 0.65,
		},
		'start+=0.1'
	)

	return tl.play()
}

// ============================================================================
// PRINT CONFIGURATION
// ============================================================================

// Cordova printer plugin options
const BORDERLESS_OPTIONS = {
	orientation: 'portrait',
	photo: true,
	autoFit: false,
	margin: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
}

// ============================================================================
// IMAGE PROCESSING UTILITIES (PDF - Currently Unused)
// ============================================================================

/**
 * Convert blob to photo-ready PNG data URL
 * Resizes to 1844x1240px (4x6 inch at 300 DPI) with white background
 * @param {Blob} blob - Input image blob
 * @returns {Promise<string>} - PNG data URL
 */
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

/**
 * Extract base64 payload from data URL and format for Cordova printer plugin
 * @param {string} dataUrl - Data URL (e.g., "data:image/png;base64,iVBOR...")
 * @returns {string} - Formatted payload ("base64://iVBOR...")
 */
const buildBase64Payload = dataUrl => {
	const [, payload] = dataUrl.split(',')
	if (!payload) throw new Error('Invalid photo data URL')
	return `base64://${payload}`
}

// ============================================================================
// PRINT FUNCTIONS
// ============================================================================

/**
 * Main print handler - captures screenshot and sends to printer
 */
const handlePrint = async () => {
	try {
		// 1. Capture screenshot
		const blob = await takeScreenshot(false)
		if (!blob) throw new Error('Failed to capture screenshot')

		// 2. Convert to data URL (PNG format for photo printer)
		const dataUrl = await buildPhotoReadyDataUrl(blob)
		console.log('📸 Screenshot ready, size:', dataUrl.length, 'chars')

		// 3. Use Cordova plugin with specific printer URL (Direct Print)
		const printer = get(selectedPrinter)
		console.log('🖨️ Sending to printer:', printer?.name)
		console.log('📍 Printer URL:', printer?.ippUrl)

		if (printer?.ippUrl) {
			const base64Payload = buildBase64Payload(dataUrl)
			// Direct print attempt using plugin
			// This uses the IPP URL discovered via ZeroConf (mdns)
			// Format: ipp://[ip]:[port]/[resource_path]

			// Semplificazione opzioni per debug fallimento
			await window.cordova.plugins.printer.print(base64Payload, {
				printer: printer.ippUrl,
				name: 'The One Experience',
				...BORDERLESS_OPTIONS,
			})

			console.log('✅ Print command sent to plugin')
			// alert('Stampa inviata con successo!')
		} else {
			console.error('No printer URL available')
			throw new Error('No printer selected')
		}
	} catch (error) {
		console.error('❌ Print error:', error)
		alert(
			rt('experience_end.print_error') ??
				'Unable to print. Please check printer connection.'
		)
	}
}

// ============================================================================
// PRINTER DISCOVERY
// ============================================================================

/**
 * Parses a discovered service and adds it to the list of available printers.
 * Filters by name if `desiredPrinterName` is set in config.
 * Constructs the IPP URL needed for direct printing.
 *
 * @param {Object} service - The ZeroConf service object
 */
const upsertPrinterFromService = service => {
	if (!service?.name) return

	const printerName = service.name
	// Filter printers if a specific name is configured in .env
	if (
		desiredPrinterName &&
		!printerName.toLowerCase().includes(desiredPrinterName.toLowerCase())
	)
		return

	// Resolve device IP address (IPv4 preferred)
	const deviceAddress =
		service.hostname ??
		service.ipv4Addresses?.[0] ??
		service.ipv6Addresses?.[0] ??
		''

	if (!deviceAddress) return

	const port = service.port || 631

	// Use resource path from txtRecord if available (critical for some printers like DNP)
	// Fallback to standard 'ipp/print' if not specified
	const resourcePath = service.txtRecord?.rp || 'ipp/print'

	const nextPrinter = {
		name: printerName,
		ip: deviceAddress,
		// Construct the full IPP URL: ipp://192.168.1.100:631/printers/NAME
		ippUrl: `ipps://${deviceAddress}:${port}/${resourcePath}`,
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

/**
 * Helper to format ZeroConf error messages into human-readable strings
 */
const formatZeroConfError = (type, error) => {
	const code = error?.code ?? error?.message

	if (code === -72008) {
		return 'Network permission denied for printer discovery'
	}

	return `ZeroConf watch error (${type}): ${error?.message ?? error}`
}

/**
 * Starts watching for printer services on the local network using mDNS (Bonjour).
 * Scans for multiple service types (_ipp._tcp, _printer._tcp, etc.) to ensure compatibility.
 *
 * @returns {Promise<boolean>} - True if watchers were successfully started
 */
const startPrinterDiscovery = async () => {
	// Only run in App Mode (Capacitor) and if not already active
	if (!isClient || !config.public.isAppMode || get(isPrinterDiscoveryActive)) {
		return false
	}

	set(printerDiscoveryError, null)

	let hasActiveWatchers = false
	await Promise.all(
		ZERO_CONF_SERVICE_TYPES.map(async type => {
			try {
				await ZeroConf.watch({ type, domain: ZERO_CONF_DOMAIN }, result => {
					if (result?.service) {
						console.log('Discovered printer service:', result.service)

						upsertPrinterFromService(result.service)
					}
				})
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

/**
 * Stops all active ZeroConf watchers to free resources.
 * Should be called on component unmount.
 */
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

// ============================================================================
// UI HANDLERS
// ============================================================================

const handleQRCodeButtonClick = () => {
	uiStore.setQrCodeModalVisible(true)
}

const handleDownloadButtonClick = async () => {
	const data = appStore.getResult
	data.set('pre-title', $t('download_card.pre_title'))
	data.set('sub-content-title', $t('download_card.subcontent_title'))

	downloadCard('experience', Number(appStore.getStep01Selection), data)
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
		onUpdate: () => {
			if (appStore.isAudioEnabled) {
				Howler.volume(1 - drawTimeline.progress())
			}
		},
		onComplete: async () => {
			Tracking.sendEvent({
				generic_event_and_label: 'press_&_hold',
			})
			trackingStore.setFunnel('5-result')

			set(canInteract, false)

			uiStore.setBackButtonVisible(false)

			audioManager.fadeOut(AUDIO_LABELS.BASE_LOOP)

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

	tl.call(
		() => {
			emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)
			appStore.isAudioEnabled && Howler.volume(1)
			audioManager.fadeIn(AUDIO_LABELS.CAMPAIGN_LOOP)
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
	@apply flex flex-col items-center text-center col-start-1 row-start-1 self-center font-body-alt;

	row-gap: toRem(11);
	width: min(toRem(230), 60vw);

	@screen tablet-portrait-lg {
		width: min(toRem(330), 40vw);
	}
}

.result-pre-title {
	@apply uppercase font-normal leading-[1.7] tracking-[0.13em] text-gold-light;

	font-size: toRem(12);

	@screen lg {
		font-size: toRem(13);
	}

	@screen tablet-portrait-lg {
		font-size: toRem(20);
	}
}

.result-title {
	@apply font-normal uppercase leading-none;

	font-size: toRem(36);

	@screen lg {
		font-size: toRem(50);
	}

	@screen tablet-portrait-lg {
		font-size: toRem(60);
	}
}

.result-copy {
	@apply font-normal leading-[1.6] tracking-[0.04em] text-gold-light;

	font-size: toRem(12);

	@screen lg {
		font-size: toRem(13);
	}

	@screen tablet-portrait-lg {
		font-size: toRem(20);
	}
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
	pointer-events: none;
}

.fade-long-enter-active {
	transition: opacity 1.5s ease;
}

.fade-long-leave-active {
	transition: opacity 0.4s ease;
}

.fade-long-enter-from,
.fade-long-leave-to {
	opacity: 0;
	pointer-events: none;
}
</style>
