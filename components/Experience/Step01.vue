<template>
	<Container class="pointer-events-none">
		<header class="header | text-shadow" ref="headerRef">
			<h2
				class="display-2 | text-gold-light"
				v-html="$t('experience_step_01.title')"
			/>
		</header>

		<div class="knob-wrapper" ref="knobWrapperRef">
			<svg
				class="size-full"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 456 456"
				overflow="visible"
			>
				<g ref="dotsRef">
					<circle
						v-for="({ x, y }, idx) in dotsCoords"
						:key="idx"
						:cx="x"
						:cy="y"
						r="6.271"
						fill="#ffdba5"
						opacity=".6"
					/>
				</g>

				<!-- Sun icon -->
				<g class="sun-icon" :data-visible="sunIconVisible">
					<path
						fill="#ffffc4"
						transform="translate(0 -107)"
						d="M227.593 353.509a1.95 1.95 0 0 1 1.939 1.723l.013.229v1.952a1.95 1.95 0 0 1-1.837 1.946 1.95 1.95 0 0 1-2.053-1.718l-.014-.228v-1.952a1.954 1.954 0 0 1 1.952-1.952m12.324-4.08.184.162 1.366 1.366a1.955 1.955 0 0 1 .082 2.669 1.953 1.953 0 0 1-2.659.253l-.183-.162-1.367-1.366a1.951 1.951 0 0 1 2.378-3.059zm-22.071.162a1.953 1.953 0 0 1 .162 2.577l-.162.183-1.366 1.366a1.95 1.95 0 0 1-2.669.082 1.95 1.95 0 0 1-.253-2.658l.162-.184 1.366-1.366a1.953 1.953 0 0 1 2.76 0m-5.87-11.699a1.952 1.952 0 0 1 .229 3.891l-.229.013h-1.952a1.953 1.953 0 0 1-1.495-3.204c.32-.382.773-.627 1.267-.686l.228-.014zm33.187 0a1.95 1.95 0 0 1 1.946 1.838 1.95 1.95 0 0 1-1.718 2.053l-.228.013h-1.953a1.953 1.953 0 0 1-1.946-1.837 1.95 1.95 0 0 1 1.718-2.053l.228-.014zm-28.867-12.083.184.162 1.366 1.367a1.95 1.95 0 0 1-1.197 3.321 1.95 1.95 0 0 1-1.379-.399l-.184-.162-1.366-1.366a1.951 1.951 0 0 1 2.375-3.059zm25.171.162c.336.337.538.784.568 1.258.03.475-.114.944-.406 1.319l-.162.184-1.366 1.366a1.954 1.954 0 0 1-2.923-2.577l.162-.183 1.367-1.367a1.95 1.95 0 0 1 2.76 0m-13.874-5.647a1.95 1.95 0 0 1 1.939 1.724l.013.228v1.952a1.951 1.951 0 0 1-3.89.229l-.014-.229v-1.952a1.953 1.953 0 0 1 1.952-1.952m0 9.76a9.76 9.76 0 1 1-9.751 10.184l-.009-.424.009-.423a9.766 9.766 0 0 1 9.751-9.337"
					/>
				</g>

				<!-- Background stroke -->
				<g mask="url(#knob-mask-background)">
					<circle
						mask="url(#track-mask)"
						cx="228"
						cy="232.25"
						r="223.25"
						stroke="#ffffc4"
						stroke-dasharray="2 12.6"
						stroke-width="28"
						stroke-opacity="0.5"
						data-stroke-opacity-target="0.5"
					/>
				</g>
			</svg>

			<div class="size-full relative z-[1] pointer-events-auto" ref="knobRef">
				<svg
					class="pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 456 456"
					overflow="visible"
				>
					<g filter="url(#dot-glow)">
						<circle
							:cx="dotsCoords[0].x"
							:cy="dotsCoords[0].x"
							:data-start-x="dotsCoords[0].x"
							:data-start-y="dotsCoords[0].x"
							:data-end-x="dotsCoords[0].x"
							:data-end-y="dotsCoords[0].y"
							r="20"
							fill="#ffffc4"
							ref="knobDotRef"
						/>
					</g>

					<defs>
						<mask id="track-mask">
							<g
								style="transform-box: fill-box; transform-origin: center"
								ref="knobMaskWrapperNewRef"
							>
								<path fill="#fff" :d="pathMaskStart" ref="knobMaskNewRef" />
							</g>
						</mask>

						<mask id="knob-mask-background">
							<g class="origin-center -rotate-90">
								<circle
									cx="228"
									cy="232.25"
									r="223.25"
									stroke="white"
									stroke-width="25"
									ref="knobTrackBackgroundRef"
								/>
							</g>
						</mask>
					</defs>
				</svg>
			</div>

			<div
				class="knob-labels | text-shadow"
				:class="{
					'text-gold-light': knobStepLiveDrag < 2,
					'text-gold-dark': knobStepLiveDrag >= 2,
				}"
			>
				<span
					v-for="(label, idx) in labels"
					:key="idx"
					class="knob-label"
					:data-index="idx"
					:data-visible="idx === knobStep && labelsVisible"
					v-html="label"
				/>
			</div>
		</div>

		<div class="instructions | text-shadow" :data-visible="instructionsVisible">
			<p class="instructions-inner pulse-100-60 | body-5 | text-gold">
				{{ $t('experience_step_01.instructions') }}
			</p>
		</div>

		<ButtonGolden
			class="cta"
			size="wide"
			:data-visible="ctaVisible"
			@click="handleClick"
		>
			{{ $t('select') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get, set } from '@vueuse/core'

import { progress as backgroundProgress } from './WebGL/materials/background'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm } = useI18n()
const { gsap, Draggable } = useGSAP()

const headerRef = useTemplateRef('headerRef')
const dotsRef = useTemplateRef('dotsRef')
const knobTrackBackgroundRef = useTemplateRef('knobTrackBackgroundRef')

const instructionsVisible = shallowRef(false)
const sunIconVisible = shallowRef(false)
const ctaVisible = shallowRef(false)
const labelsVisible = shallowRef(false)

const dotsCoords = [
	{ x: 228.86, y: 64.097 },
	{ x: 396.634, y: 225.365 },
	{ x: 227.233, y: 400.802 },
	{ x: 59.694, y: 231.636 },
]

const knobRef = useTemplateRef('knobRef')
const knobMaskWrapperNewRef = useTemplateRef('knobMaskWrapperNewRef')
const knobMaskNewRef = useTemplateRef('knobMaskNewRef')
const knobDotRef = useTemplateRef('knobDotRef')
const knobStep = shallowRef(0)
const knobStepLiveDrag = shallowRef(0)

const labels = computed(() => {
	return Object.values(tm('experience_step_01.labels')).map(label => rt(label))
})

const pathMaskStart =
	'M468 228c0 132.548-107.452 240-240 240S-12 360.548-12 228C-12 109.255 74.238 10.652 187.5-8.597A241.6 241.6 0 0 1 228-12c13.803 0 27.334 1.165 40.5 3.403C381.762 10.652 468 109.255 468 228'
const pathMaskEnd =
	'M447 228c0 120.95-98.05 219-219 219S9 348.95 9 228C9 119.645 88.255 32.71 191.044 12.105 221.5 6 218.5-11 228-11s7.5 18.099 36.956 23.105C368.308 29.67 447 119.645 447 228'

let draggableInstance = null

//
// Lifecycle
//
onMounted(async () => {
	setInitialStyles()

	await nextTick()

	animateIn()

	draggableInstance = Draggable.create(get(knobRef), {
		type: 'rotation',
		inertia: true,
		throwResistance: 50000,
		dragResistance: 0,
		edgeResistance: 1,
		maxDuration: 0.8,
		snap(value) {
			return Math.round(value / 90) * 90
		},
		onPressInit() {
			gsap.to(get(knobDotRef), {
				attr: {
					r: 26,
				},
				duration: 0.5,
				ease: 'back.out(2)',
				overwrite: true,
			})
		},
		onRelease() {
			gsap.to(get(knobDotRef), {
				attr: {
					r: 20,
				},
				duration: 0.5,
				ease: 'back.out(3)',
				overwrite: true,
			})
		},
		onDrag() {
			set(instructionsVisible, false)
			set(sunIconVisible, false)
			set(labelsVisible, true)
			set(ctaVisible, true)
			update()
		},
		onThrowUpdate() {
			update()
		},
		onThrowComplete() {
			updateKnobSteponThrowComplete()
		},
	})

	draggableInstance?.[0]?.disable()

	function update() {
		const { rotation } = draggableInstance[0]

		gsap.set(get(knobMaskWrapperNewRef), {
			transform: `rotate(${rotation}deg)`,
		})

		let step = Math.round(rotation / 90) % 4
		if (Math.sign(step) === -1) step = 4 + step

		set(knobStepLiveDrag, Math.abs(step))

		let bg = rotation % 360
		if (Math.sign(bg) === -1) bg = 360 + bg
		backgroundProgress.value = bg / 360
	}

	function updateKnobSteponThrowComplete() {
		const { rotation } = draggableInstance[0]

		let step = Math.floor(rotation / 90) % 4
		if (Math.sign(step) === -1) step = 4 + step

		set(knobStep, Math.abs(step))
	}

	update()
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
})

//
// Methods
//
const setInitialStyles = () => {
	gsap.set([get(headerRef), get(dotsRef), get(knobRef)], {
		opacity: 0,
	})

	gsap.set(get(knobTrackBackgroundRef), {
		drawSVG: '0% 0%',
	})
}

const animateIn = () => {
	const tl = gsap.timeline()
	tl.addLabel('start')

	// Header
	tl.fromTo(
		[get(headerRef)],
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 1.2,
		},
		'start'
	)

	// Knob opacity
	tl.fromTo(
		get(knobRef),
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1.5,
		},
		'<0.3'
	)

	// Knob scale
	tl.fromTo(
		get(knobDotRef),
		{
			transformOrigin: 'center',
			scale: 1,
		},
		{
			scale: 1.4,
			duration: 0.75,
			repeat: 1,
			yoyo: true,
		},
		'<'
	)

	// Draw background stroke
	tl.fromTo(
		get(knobTrackBackgroundRef),
		{
			drawSVG: '0% 0%',
		},
		{
			drawSVG: '0% 100%',
			duration: 3,
			ease: 'power1.out',
		},
		'<0.3'
	)

	// Knob position
	tl.fromTo(
		get(knobDotRef),
		{
			attr: {
				cx: () => get(knobDotRef).dataset.startX,
				cy: () => get(knobDotRef).dataset.startY,
			},
		},
		{
			attr: {
				cx: () => get(knobDotRef).dataset.endX,
				cy: () => get(knobDotRef).dataset.endY,
			},
			duration: 1.6,
			ease: 'power3.inOut',
		},
		'<1.5'
	)

	tl.fromTo(
		get(knobMaskNewRef),
		{
			morphSVG: {
				shape: pathMaskStart,
			},
		},
		{
			morphSVG: {
				shape: pathMaskEnd,
				shapeIndex: 0,
			},
			duration: 1.5,
		},
		'<0.5'
	)

	// Show sun icon and dots
	tl.fromTo(
		get(dotsRef),
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1.2,
			ease: 'power1.inOut',
			stagger: 0.6,
		},
		'<0.3'
	)

	// Show labels and enable draggable
	tl.call(
		() => {
			draggableInstance?.[0]?.enable()
			set(sunIconVisible, true)
		},
		null,
		'<0.2'
	)

	// Show instructions
	tl.call(
		() => {
			set(instructionsVisible, true)
		},
		null,
		'<0.4'
	)
}

const handleClick = () => {
	appStore.setStep01Selection(get(knobStep))
	uiStore.setExperienceStep01Visible(false)
	uiStore.setExperienceStep02Visible(true)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;

	grid-template-areas:
		'a'
		'b'
		'c';
	grid-template-rows: auto 1fr auto;
}

.header {
	@apply text-center uppercase;

	grid-area: a;
}

.knob-wrapper {
	@apply grid aspect-square self-center;

	width: min(40svh, toRem(275));

	@screen landscape {
		width: min(40svh, toRem(450));
	}

	grid-area: b;

	> * {
		@apply col-start-1 row-start-1;
	}
}

.knob-labels {
	@apply grid;
	@apply transition-colors duration-500 ease-out;
	@apply justify-self-center self-center;

	> * {
		@apply col-start-1 row-start-1;
	}
}

.knob-label {
	@apply text-center;
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.sun-icon {
	@apply transition-opacity duration-300 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.instructions,
.cta {
	@apply self-start;
	@apply transition-opacity duration-1000 ease-out;

	grid-area: c;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	&[data-visible='true'] {
		&:is(.cta) {
			@apply pointer-events-auto;
		}
	}
}
</style>
