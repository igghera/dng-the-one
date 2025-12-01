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
			<div v-if="showResult && appStore.getResult" class="result | text-shadow">
				<span class="body-9 | uppercase text-gold-light">
					{{ $t('experience_end.title') }}
				</span>

				<span class="display-3 | golden-text | uppercase">
					{{ appStore.getResult.get('auraFull').title }}
				</span>

				<span class="body-10 | text-gold-light">
					{{
						appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
							.desc
					}}
				</span>
			</div>
		</Transition>

		<Transition name="fade-long">
			<nav
				v-if="
					showResult &&
					appStore.getResult &&
					!uiStore.isResultsScrollDownVisible
				"
				class="buttons"
			>
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
							>{{ $t('results.cta_download') }}</ButtonGolden
						>
					</template>

					<template v-else>
						<ButtonRestart />

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
import { get, set } from '@vueuse/core'
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

const { rt, tm } = useI18n()
const { gsap, Observer, SplitText } = useGSAP()

const appStore = useAppStore()
const uiStore = useUiStore()

const showResult = shallowRef(false)

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
// Lifecycle
//
onMounted(async () => {
	setInitialState()

	await animateInHeader()

	const res = calculateResult(
		appStore.getStep01Selection,
		appStore.getStep02Selection,
		appStore.getStep03Selection,
		allAuras,
		allProducts,
		allAurasFull
	)
	appStore.setResult(res.result)

	experienceEndDrawMaterial.mapIndex.value =
		res.result.get('shape') === 'male' ? 0 : 1

	if (!uiStore.isExperienceEndVisible) return

	await gsap.delayedCall(0.5, () => {})

	animateOutHeader()

	emitter.emit(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_START)

	createButtonTimeline()
})

onBeforeUnmount(() => {
	drawTimeline?.kill()
	pointerObserver?.kill()

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
	gsap.set(get(introHeaderRef), { autoAlpha: 1 })
}

const handlePrint = async () => {
	const blob = await takeScreenshot(false)
	const url = URL.createObjectURL(blob)

	const img = document.createElement('img')

	img.addEventListener(
		'load',
		() => {
			// TODO: Print the image
			alert('TODO: Implement print feature')

			// `img` is the image to print

			// (debug) Adding the image to the DOM
			// Object.assign(img.style, {
			// 	position: 'fixed',
			// 	top: 0,
			// 	left: 0,
			// 	width: '30%',
			// 	height: 'auto',
			// })

			// document.body.appendChild(img)

			URL.revokeObjectURL(url)
		},
		{ once: true }
	)

	img.src = url
}

const handleQRCodeButtonClick = () => {
	uiStore.setQrCodeModalVisible(true)
}

const handleDownloadButtonClick = async () => {
	downloadImage('/mock-download-card.png', 'the-one-card.png')

	return

	takeScreenshot(true)
}

const handleRestartButtonClick = () => {
	emitter.emit(EVENTS.RESTART)
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
			value: 0.012,
			duration: 0.8,
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

	aspect-ratio: 240 / 300;
	height: 30svh;
	translate: 0 8svh;
	row-gap: toRem(10);
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
