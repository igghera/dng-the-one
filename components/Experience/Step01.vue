<template>
	<Container class="pointer-events-none" :data-ready="ready">
		<header class="header" ref="headerRef">
			<h2
				class="display-2 | golden-text text-shadow | uppercase font-medium"
				v-html="$t('experience_step_01.title')"
			/>

			<div class="labels">
				<span
					v-for="(label, idx) in labels"
					v-html="label"
					:key="idx"
					class="label"
					:data-index="idx"
					:data-visible="idx === knobStep && labelsVisible"
				/>
			</div>
		</header>

		<div class="knob-wrapper" ref="knobWrapperRef">
			<div
				class="bars-wrapper"
				:style="{
					'--current': knobRotationRadians,
				}"
				ref="barsWrapperRef"
			>
				<span
					v-for="i in numBars"
					:key="i"
					class="bar"
					:style="{
						'--angle': ((i - 1) * Math.PI * 2) / numBars - Math.PI / 2,
					}"
					ref="barsRef"
				>
				</span>
			</div>

			<svg
				class="size-full"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 456 456"
				overflow="visible"
			>
				<g>
					<circle
						v-for="({ x, y }, idx) in dotsCoords"
						style="opacity: 0"
						:key="idx"
						:cx="x"
						:cy="y"
						r="6.271"
						fill="#ffdba5"
						fill-opacity=".6"
						ref="dotsRef"
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
			</svg>

			<div class="size-full relative z-[1] pointer-events-auto" ref="knobRef">
				<svg
					class="pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 456 456"
					overflow="visible"
				>
					<g
						style="transform-box: fill-box; transform-origin: center"
						:data-start-x="dotsCoords[0].x"
						:data-start-y="dotsCoords[0].x"
						:data-end-x="dotsCoords[0].x"
						:data-end-y="dotsCoords[0].y"
						ref="knobDotWrapperRef"
					>
						<image
							id="glowing-dot"
							href="/images/glowing-dot.webp"
							width="345"
							height="345"
							ref="knobDotRef"
							transform="translate(-172.5, -172.5)"
						/>
					</g>
				</svg>
			</div>
		</div>

		<div class="instructions | text-shadow" :data-visible="instructionsVisible">
			<p class="instructions-inner pulse-100-60 | body-5 | text-gold">
				{{ $t('experience_step_01.instructions') }}
			</p>
		</div>

		<ButtonGolden
			class="cta | !text-gold"
			size="wide"
			:data-visible="ctaVisible"
			@click="handleClick"
			ref="ctaRef"
		>
			{{ $t('select') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get, set, useStorage } from '@vueuse/core'
import slugify from 'voca/slugify'

import { progress as backgroundProgress } from './WebGL/materials/background'
import {
	colorA as godraysColorA,
	colorB as godraysColorB,
	godraysColor,
} from './WebGL/materials/godrays'

import {
	thresholdA as bloomThresholdA,
	thresholdB as bloomThresholdB,
	threshold as bloomThreshold,
} from './WebGL/nodes/bloom'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()
const trackingStore = useTrackingStore()

const { rt, tm } = useI18n()
const { gsap, Draggable, Flip } = useGSAP()

const headerRef = useTemplateRef('headerRef')
const dotsRef = useTemplateRef('dotsRef')
const ctaRef = useTemplateRef('ctaRef')

const instructionsVisible = shallowRef(false)
const sunIconVisible = shallowRef(false)
const ctaVisible = shallowRef(false)
const labelsVisible = shallowRef(false)

const storage = useStorage('experience-answers', {})

const dotsCoords = [
	{ x: 228, y: 64.097 },
	{ x: 396.634, y: 228 },
	{ x: 228, y: 400.802 },
	{ x: 59.694, y: 228 },
]

const knobRef = useTemplateRef('knobRef')
const knobDotWrapperRef = useTemplateRef('knobDotWrapperRef')
const knobDotRef = useTemplateRef('knobDotRef')
const knobStep = shallowRef(0)
const knobRotation = shallowRef(0)

const barsWrapperRef = useTemplateRef('barsWrapperRef')
const { width: barsWrapperWidth } = useElementBounding(barsWrapperRef)
const numBars = shallowRef(150)
const barsRef = useTemplateRef('barsRef')

const ready = shallowRef(false)

const labels = computed(() => {
	return Object.values(tm('experience_step_01.labels')).map(label => rt(label))
})

const labelsEN = Object.freeze([
	'Refined and exclusive',
	'Bold and commanding',
	'Mysterious and magnetic',
	'Confident and sophisticated',
])

let draggableInstance = null

//
// Computed
//
const knobRotationRadians = computed(() => {
	return gsap.utils.wrap(0, Math.PI * 2, get(knobRotation) * (Math.PI / 180))
})

//
// Lifecycle
//
onMounted(async () => {
	setInitialStyles()

	trackingStore.setFunnel('2')

	await nextTick()

	animateIn()

	let rotationOnPress = 0

	draggableInstance = Draggable.create(get(knobRef), {
		type: 'rotation',
		inertia: true,
		throwResistance: 50000,
		dragResistance: 0,
		edgeResistance: 1,
		maxDuration: 0.8,
		minimumMovement: 4,
		snap: snapTo90,
		onClick: evt => {
			const { rotation } = draggableInstance[0]
			const currentRotation = rotation % 360
			const clickAngle = getClickAngle(evt, get(knobRef)) + 90

			const targetRotation = snapTo90(clickAngle)
			const deltaRotation = shortestAngleDelta(currentRotation, targetRotation)

			// Update draggable's rotation target
			gsap.to(get(knobRef), {
				rotation: draggableInstance[0].rotation + deltaRotation,
				onUpdate: () => {
					draggableInstance[0].update()
					update()
				},
				duration: 0.4,
				ease: 'power2.out',
				overwrite: true,
			})

			set(instructionsVisible, false)
			set(ctaVisible, true)
		},
		onPress() {
			gsap.to(get(knobDotRef), {
				scale: 1.15,
				duration: 0.5,
				ease: 'back.out(2)',
				overwrite: true,
			})

			rotationOnPress = draggableInstance[0].rotation
		},
		onDrag() {
			set(instructionsVisible, false)
			set(ctaVisible, true)
			update()
		},
		onThrowUpdate() {
			update()
		},
	})

	draggableInstance?.[0]?.disable()

	function update() {
		const { rotation } = draggableInstance[0]

		let step = Math.round(rotation / 90) % 4
		if (Math.sign(step) === -1) step = 4 + step

		set(knobStep, Math.abs(step))
		set(knobRotation, rotation)

		let bg = rotation % 360
		if (Math.sign(bg) === -1) bg = 360 + bg
		backgroundProgress.value = bg / 360
	}

	function shortestAngleDelta(current, target) {
		let delta = (target - current) % 360
		if (delta > 180) delta -= 360
		if (delta < -180) delta += 360

		return delta
	}

	function snapTo90(value) {
		return Math.round(value / 90) * 90
	}

	function getClickAngle(evt, element) {
		const rect = element.getBoundingClientRect()
		const cx = rect.left + rect.width / 2
		const cy = rect.top + rect.height / 2

		const dx = evt.clientX - cx
		const dy = evt.clientY - cy

		return Math.atan2(dy, dx) * (180 / Math.PI)
	}

	update()
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
})

//
// Events
//
emitter.on(EVENTS.RESTART, () => {
	gsap.killTweensOf(get(knobDotWrapperRef))
})

//
// Watchers
//
watch(knobStep, value => {
	audioManager.play(AUDIO_LABELS.SFX_CLICK)
})

watchEffect(() => {
	const godraysFinalColor = get(knobStep) < 2 ? godraysColorA : godraysColorB

	gsap.to(godraysColor.value, {
		r: godraysFinalColor[0],
		g: godraysFinalColor[1],
		b: godraysFinalColor[2],
		duration: 0.8,
		overwrite: true,
	})

	gsap.to(bloomThreshold, {
		value: get(knobStep) < 2 ? bloomThresholdA : bloomThresholdB,
		duration: 0.8,
		overwrite: true,
	})
})

//
// Methods
//
const setInitialStyles = () => {
	gsap.set([get(headerRef), get(knobRef)], {
		opacity: 0,
	})

	gsap.set(get(barsRef), { clearProps: 'opacity', visibility: 'hidden' })
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
	tl.set(
		get(barsRef),
		{
			visibility: 'visible',
			stagger: {
				amount: 3,
			},
			onStart: () => {
				audioManager.play(AUDIO_LABELS.SFX_STEP_01_ANIMATE_IN)
			},
		},
		'<0.3'
	)

	// Show dots
	tl.fromTo(
		get(dotsRef),
		{
			opacity: 0,
			scale: 0.35,
			transformOrigin: 'center',
		},
		{
			opacity: 1,
			duration: 0.85,
			ease: 'power1.out',
			stagger: {
				amount: 1.75,
			},
			scale: 1,
		},
		'<0.5'
	)

	// Knob position
	tl.fromTo(
		get(knobDotWrapperRef),
		{
			x: () => get(knobDotWrapperRef).dataset.startX,
			y: () => get(knobDotWrapperRef).dataset.startX,
		},
		{
			x: () => get(knobDotWrapperRef).dataset.endX,
			y: () => get(knobDotWrapperRef).dataset.endY,
			duration: 1.6,
			ease: 'power2.inOut',
		},
		'<1.7'
	)

	tl.call(
		() => {
			set(sunIconVisible, true)
		},
		null,
		'<0.3'
	)

	tl.call(
		() => {
			set(ready, true)
		},
		null,
		'>1'
	)

	tl.add(wiggleKnob(), '>0.5')

	// Show labels and enable draggable
	tl.call(
		() => {
			draggableInstance?.[0]?.enable()
			set(labelsVisible, true)
		},
		null,
		'>'
	)

	// Show instructions
	tl.call(
		() => {
			set(instructionsVisible, true)
		},
		null,
		'<0.1'
	)
}

const animateOut = async () => {
	audioManager.play(AUDIO_LABELS.SFX_TRANSITION)

	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.set(
		get(barsRef),
		{
			opacity: 0,
			stagger: {
				amount: 1.6,
			},
		},
		'start'
	)

	tl.to(
		[get(headerRef), get(dotsRef), get(ctaRef).$el],
		{
			opacity: 0,
			duration: 1,
			onStart: () => {
				set(labelsVisible, false)
				set(sunIconVisible, false)
			},
		},
		'start+=0.3'
	)

	return tl.play()
}

const moveDotToNextPosition = async () => {
	const state = Flip.getState(get(knobDotRef))

	document.getElementById('dot-wrapper-step-02').appendChild(get(knobDotRef))

	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.add(
		Flip.from(state, {
			duration: 1.6,
			ease: 'power3.inOut',
		}),
		'start'
	)

	tl.to(
		get(knobDotRef),
		{
			scale: 0.65,
			duration: 0.5,
			ease: 'power1.out',
		},
		'>'
	)

	tl.to(
		get(knobDotRef),
		{
			scale: 0.85,
			duration: 0.5,
			ease: 'power1.out',
		},
		'>'
	)

	return tl.play()
}

const wiggleKnob = () => {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.to(
		get(knobRef),
		{
			rotation: 12,
			duration: 0.65,
			ease: 'power2.out',
		},
		'start'
	)

	tl.to(
		get(knobRef),
		{
			rotation: -12,
			duration: 0.8,
			ease: 'power2.out',
		},
		'>0.05'
	)

	tl.to(
		get(knobRef),
		{
			rotation: 0,
			duration: 0.65,
			ease: 'power2.out',
		},
		'>0.05'
	)

	tl.timeScale(1.2)

	return tl.play()
}

const handleClick = async () => {
	Tracking.sendEvent({
		generic_event_and_label: 'select',
		customizator_option: slugify(labelsEN[get(knobStep)]),
	})
	// trackingStore.setFunnel('3')

	draggableInstance?.[0]?.kill()

	await animateOut()

	appStore.setStep01Selection(get(knobStep))
	storage.value.q1 = get(knobStep)

	uiStore.setExperienceStep02Visible(true)

	await nextTick()

	// console.log('▶️ emitted: EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_START')
	emitter.emit(EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_START)

	emitter.once(EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_COMPLETE, async () => {
		// console.log(
		// 	'✅ received: EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_COMPLETE'
		// )

		await moveDotToNextPosition()

		// console.log('▶️ emitted: EVENTS.EXPERIENCE_STEP_02_DOT_ANIMATE_IN_COMPLETE')
		emitter.emit(EVENTS.EXPERIENCE_STEP_02_DOT_ANIMATE_IN_COMPLETE)

		uiStore.setExperienceStep01Visible(false)
	})
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;

	grid-template-areas:
		'a'
		'.'
		'b'
		'.'
		'c';
	grid-template-rows:
		auto
		theme('spacing.8')
		1fr
		theme('spacing.10')
		auto;
}

.header {
	@apply text-center flex flex-col gap-y-5;
	@apply md:portrait:gap-y-9;
	@apply md:landscape:gap-y-6;

	grid-area: a;
}

.knob-wrapper {
	@apply grid aspect-square self-center;

	height: min(100%, toRem(450));
	grid-area: b;

	> * {
		@apply col-start-1 row-start-1;
	}
}

.labels {
	@apply grid text-gold-light;
	@apply transition-colors duration-500 ease-out;
	@apply justify-self-center self-center;

	> * {
		@apply col-start-1 row-start-1;
	}
}

.label {
	@apply text-center font-medium text-base leading-snug tracking-[0.05em];
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	@screen md {
		font-size: toRem(27);
		line-height: 1.15;
	}
}

.sun-icon {
	@apply transition-opacity duration-1000 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.instructions,
.cta {
	@apply self-center;
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

.bars-wrapper {
	@apply grid items-start justify-start size-full pointer-events-none;

	--scale-multiplier: 1;

	[data-ready='true'] & {
		--scale-multiplier: 0;
	}
}

.bar {
	@apply w-[10px] h-[2px] bg-gold-light origin-left col-start-1 row-start-1 block;
	@apply md:w-[18px];

	--r: calc(v-bind(barsWrapperWidth) * 0.5px);
	--x: calc(cos(var(--angle, 0)) * (var(--r) - 14px) + var(--r));
	--y: calc(sin(var(--angle, 0)) * (var(--r) - 14px) + var(--r));
	--progress: clamp(0, pow((var(--current) - var(--angle)) / 1.5708, 9), 1);
	--sx: calc(0.4 + min(0.6, (0.6 * var(--progress) + var(--scale-multiplier))));

	opacity: calc(
		0.56 + min(0.44, 0.44 * var(--progress) + var(--scale-multiplier))
	);
	transform: translate(var(--x), var(--y)) rotate(calc(var(--angle) * 1rad))
		scale(var(--sx), 1);

	[data-ready='true'] & {
		@apply ease-out;

		transition-property: opacity, transform;
		transition-duration: 0.2s, 1s;
	}
}
</style>
