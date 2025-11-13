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
			<div v-if="result" class="result | text-shadow">
				<span class="body-9 | uppercase text-gold-light">
					{{ $t('experience_end.title') }}
				</span>

				<span class="display-3 | golden-text | uppercase">
					{{ result.title }}
				</span>

				<span class="body-10 | text-gold-light">
					{{ result.copy }}
				</span>
			</div>
		</Transition>

		<Transition name="fade-long">
			<nav v-if="result" class="buttons">
				<div class="buttons-row">
					<template v-if="config.public.isAppMode">
						<ButtonGolden
							v-if="config.public.isAppMode && canPrint"
							@click="handlePrint"
							>{{ $t('results.cta_print') }}</ButtonGolden
						>

						<ButtonGolden
							:size="canPrint ? 'auto' : 'wide'"
							@click="handleQRCodeButtonClick"
							>{{ $t('results.cta_download') }}</ButtonGolden
						>
					</template>

					<template v-else>
						<ButtonRestart />

						<ButtonGolden @click="handleDownloadButtonClick">{{
							$t('results.cta_download')
						}}</ButtonGolden>
					</template>
				</div>

				<div class="buttons-row">
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
import {
	progress as maskProgress,
	borderWidth as maskBorderWidth,
} from '~/components/Experience/WebGL/materials/mask'

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

const uiStore = useUiStore()

const result = shallowRef(null)

let drawTimeline, pointerObserver

//
// Lifecycle
//
onMounted(async () => {
	setInitialState()

	await animateInHeader()

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

const getResult = () => {
	const options = Object.values(tm('experience_end.options')).map(option => ({
		title: rt(option.title),
		copy: rt(option.copy),
	}))

	// TODO: Implement proper result
	return options[0]
}

const handlePrint = () => {
	alert('TODO: Implement print feature')
}

const handleQRCodeButtonClick = () => {
	alert('TODO: Implement QR Code popup')
}

const handleDownloadButtonClick = () => {
	const imageSrc = `/images/mock-download-card.webp`
	downloadImage(imageSrc, 'the-one-card.png')
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

const animateMask = () => {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.fromTo(
		maskProgress,
		{
			value: 0,
		},
		{
			value: 1,
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
			value: 0.02,
			duration: 0.8,
		},
		'<0.3'
	)

	tl.call(
		async () => {
			emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)
			set(result, getResult())

			uiStore.setResultsVisible(true)
			await nextTick()
			get(lenis).start()
		},
		null,
		'>-0.05'
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
	translate: 0 7svh;
	row-gap: toRem(10);
}

.buttons {
	--translateY: 55%;
	--offset: calc(900px / 100svh * var(--translateY));

	@apply col-start-1 row-start-1 grid grid-cols-1 gap-6 items-center justify-center self-end;

	translate: 0 var(--offset);

	:deep(> *) {
		@apply pointer-events-auto;
	}

	@media (min-height: 700px) {
		--translateY: 50%;
	}

	@media (min-height: 900px) {
		--translateY: 40%;
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

.fade-long-enter-active,
.fade-long-leave-active {
	transition: opacity 1s ease 0.5s;
}

.fade-long-enter-from,
.fade-long-leave-to {
	opacity: 0;
}
</style>
