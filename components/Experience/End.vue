<template>
	<Container class="pointer-events-none">
		<header
			class="self-start col-start-1 row-start-1"
			style="opacity: 0.0001"
			ref="introHeaderRef"
		>
			<h2 class="flex flex-col gap-y-2 lg:gap-y-7 text-center items-center">
				<span
					class="body-8 | text-gold-light"
					v-html="$t('experience_end.intro_title[0]')"
				/>
				<span
					class="display-1-alt | golden-text | uppercase font-medium"
					v-html="$t('experience_end.intro_title[1]')"
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
				class="text-base leading-none font-medium tracking-[0.03em] text-gold-light"
				ref="ctaLabelRef"
				>{{ $t('experience_end.cta') }}</span
			>
		</button>
	</Container>
</template>

<script setup>
import { get, set } from '@vueuse/core'
import { progress as maskProgress } from '~/components/Experience/WebGL/materials/mask'

//
// Refs / State
//
const introHeaderRef = useTemplateRef('introHeaderRef')
const buttonRef = useTemplateRef('buttonRef')
const backgroundCircleWrapperRef = useTemplateRef('backgroundCircleWrapperRef')
const fillingCircleWrapperRef = useTemplateRef('fillingCircleWrapperRef')
const fillingCircleRef = useTemplateRef('fillingCircleRef')
const ctaLabelRef = useTemplateRef('ctaLabelRef')

const canInteract = shallowRef(true)

const { gsap, Observer, SplitText } = useGSAP()

let drawTimeline, pointerObserver

//
// Lifecycle
//
onMounted(async () => {
	await animateInHeader()

	gsap.delayedCall(2, () => {})

	animateOutHeader()
	emitter.emit(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_START)

	createButtonTimeline()
})

onBeforeUnmount(() => {
	drawTimeline?.kill()
	pointerObserver?.kill()
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
	const split = SplitText.create(
		get(introHeaderRef).querySelectorAll('span')[0],
		{
			type: 'lines',
		}
	)

	gsap.set(get(introHeaderRef), { autoAlpha: 1 })

	const lines = [
		...split.lines,
		get(introHeaderRef).querySelectorAll('span')[1],
	]

	return gsap.fromTo(
		lines,
		{ autoAlpha: 0 },
		{
			autoAlpha: 1,
			duration: 1,
			stagger: 0.1,
			ease: 'power1.out',
		}
	)
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

	tl.call(
		() => {
			emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)
		},
		null,
		'>-0.05'
	)
}
</script>

<style lang="scss" scoped>
:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;
}

.btn {
	@apply col-start-1 row-start-1 self-center grid items-center justify-items-center text-center pointer-events-auto *:pointer-events-none *:col-start-1 *:row-start-1;

	-webkit-touch-callout: none; /* Disable context menu */
}
</style>
