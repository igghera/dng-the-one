<template>
	<button class="btn" ref="buttonRef">
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

		<span class="btn-label | text-shadow">{{ $t('press_and_hold') }}</span>
	</button>
</template>

<script setup>
import { get } from '@vueuse/core'

//
// Props
//
const props = defineProps({
	onPress: {
		type: Function,
		default: () => {},
	},
	onRelease: {
		type: Function,
		default: () => {},
	},
	onComplete: {
		type: Function,
		default: () => {},
	},
})

//
// Refs / State
//
const { gsap, Observer } = useGSAP()

const buttonRef = useTemplateRef('buttonRef')
const backgroundCircleWrapperRef = useTemplateRef('backgroundCircleWrapperRef')
const fillingCircleWrapperRef = useTemplateRef('fillingCircleWrapperRef')
const fillingCircleRef = useTemplateRef('fillingCircleRef')

let drawTimeline, pointerObserver

//
// Lifecycle
//
onMounted(() => {
	createButtonTimeline()
	createPointerObserver()
})

onBeforeUnmount(() => {
	drawTimeline?.kill()
	pointerObserver?.kill()
})

//
// Methods
//
const createButtonTimeline = () => {
	drawTimeline = gsap.timeline({
		paused: true,
		onComplete: props.onComplete,
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
		type: 'pointer,touch',
		onPress: () => {
			props.onPress()

			gsap.to(drawTimeline, {
				progress: 1,
				duration: 1.4,
				ease: 'power2.out',
				overwrite: true,
			})
		},
		onRelease: () => {
			props.onRelease()

			gsap.to(drawTimeline, {
				progress: 0,
				duration: 1,
				ease: 'circ.out',
				overwrite: true,
			})
		},
	})
}
</script>

<style lang="css" scoped>
.btn {
	@apply col-start-1 row-start-1 self-center grid items-center justify-items-center text-center pointer-events-auto *:pointer-events-none *:col-start-1 *:row-start-1;

	-webkit-touch-callout: none; /* Disable context menu */
}

.btn-label {
	@apply leading-none font-medium tracking-[0.03em] text-gold;
}
</style>
