<template>
	<Container class="pointer-events-none">
		<header class="header | text-shadow" ref="headerRef">
			<h2
				class="display-2 | golden-text uppercase"
				v-html="$t('experience_step_02.title')"
			/>

			<div class="labels">
				<span
					class="label | body-7"
					v-for="(label, idx) in labels"
					:key="label"
					:data-index="idx"
					:data-visible="currentStep === idx"
				>
					{{ label }}
				</span>
			</div>
		</header>

		<div class="content" ref="contentRef">
			<div class="track-wrapper">
				<svg
					class="track"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 116 600"
					overflow="visible"
					ref="trackRef"
				>
					<g mask="url(#dragger-mask)">
						<rect x="0" y="0" width="116" height="600" fill="transparent" />

						<path
							class="stroke-gold-light"
							stroke-dasharray="1.5 18"
							stroke-width="8"
							d="M58 0v600"
						/>
					</g>

					<g>
						<circle
							v-for="(dot, idx) in dotsCoords"
							:key="idx"
							class="fill-gold-light"
							:cx="dot.x"
							:cy="dot.y"
							r="10"
						/>
					</g>

					<g
						class="dragger | pointer-events-auto"
						transform="translate(0, 580)"
						ref="draggerRef"
					>
						<circle
							class="stroke-gold-light fill-transparent"
							cx="58"
							cy="55"
							r="46"
							stroke-width="2"
							ref="draggerCircleRef"
						/>

						<g transform="translate(11, 4)">
							<path
								class="fill-gold-light"
								d="M47.16 42.563a1.32 1.32 0 0 1 2.005 0l6.635 7.74c.734.857.126 2.18-1.002 2.18h-13.27c-1.127 0-1.736-1.323-1.002-2.18z"
							/>
						</g>

						<g class="arrows">
							<g
								class="dragger-arrow"
								transform="translate(48, -14)"
								:data-visible="
									currentStep >= 0 && currentStep < 3 && !isPressed
								"
							>
								<path
									class="fill-gold-light"
									d="M9.658.792a.5.5 0 0 1 .759 0l8.644 10.085a.5.5 0 0 1-.38.825H1.394a.5.5 0 0 1-.38-.825z"
								/>
							</g>

							<g
								class="dragger-arrow"
								transform="translate(48, 124) scale(1, -1)"
								:data-visible="currentStep > 0 && !isPressed"
							>
								<path
									class="fill-gold-light"
									d="M9.658.792a.5.5 0 0 1 .759 0l8.644 10.085a.5.5 0 0 1-.38.825H1.394a.5.5 0 0 1-.38-.825z"
								/>
							</g>
						</g>
					</g>

					<defs>
						<mask id="dragger-mask">
							<rect x="0" y="-100" width="116" height="700" fill="white" />

							<g ref="draggerMaskRef">
								<circle cx="58" cy="58" r="58" fill="url(#dragger-gradient)" />
							</g>

							<g transform="translate(0, 550)" ref="trackMaskInitialRef">
								<rect x="0" y="0" width="116" height="300" fill="black"></rect>
							</g>
						</mask>

						<radialGradient id="dragger-gradient">
							<stop offset="50%" stop-color="black" />
							<stop offset="100%" stop-color="white" />
						</radialGradient>
					</defs>
				</svg>
			</div>
		</div>

		<div class="instructions | text-shadow" :data-visible="currentStep === -1">
			<p class="instructions-inner pulse-100-60 | body-5 | text-gold-light">
				{{ $t('experience_step_02.instructions') }}
			</p>
		</div>

		<ButtonGolden
			class="cta"
			size="wide"
			:data-visible="currentStep >= 0"
			@click="handleClick"
		>
			{{ $t('select') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get, set } from '@vueuse/core'
import {
	opacity as particlesOpacity,
	strength as particlesStrength,
	speed as particlesSpeed,
	sizeMax as particlesSizeMax,
} from './WebGL/materials/particles'

import {
	opacity as godraysOpacity,
	smoothBottom as godraysSmoothBottom,
	scaleTop as godraysScaleTop,
	scaleBottom as godraysScaleBottom,
	timeSpeed as godraysTimeSpeed,
	obstructionScale as godraysObstructionScale,
} from './WebGL/materials/godrays'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm } = useI18n()

const currentStep = shallowRef(-1)
const isPressed = shallowRef(false)

const { idle: isIdle, reset: resetIdle, stop: stopIdle } = useIdle(2500)

const { gsap, Draggable } = useGSAP()

const headerRef = useTemplateRef('headerRef')
const contentRef = useTemplateRef('contentRef')
const draggerRef = useTemplateRef('draggerRef')
const draggerCircleRef = useTemplateRef('draggerCircleRef')
const draggerMaskRef = useTemplateRef('draggerMaskRef')
const trackRef = useTemplateRef('trackRef')
const trackMaskInitialRef = useTemplateRef('trackMaskInitialRef')

const dotsCoords = [
	{ x: 58, y: 450 },
	{ x: 58, y: 293 },
	{ x: 58, y: 136 },
	{ x: 58, y: -17 },
]

const trackTranslateValues = [-15, 11, 37, 62]

let draggableInstance = null
let idleTween = null

//
// Computed
//
const labels = computed(() => {
	return Object.values(tm('experience_step_02.labels')).map(label => rt(label))
})

//
// Lifecycle
//
onMounted(async () => {
	setInitialState()

	await nextTick()

	gsap.set(get(trackRef), {
		yPercent: trackTranslateValues[0],
	})

	animateIn()

	draggableInstance = Draggable.create(get(draggerRef), {
		type: 'y',
		inertia: true,
		edgeResistance: 1,
		bounds: {
			top: -17 - 48 - 18,
			left: 0,
			height: 760,
			width: 116,
		},
		snap: function (value) {
			let values = null

			switch (get(currentStep)) {
				case -1:
					// X ❌
					// X ❌
					// X ❌
					// X ✅
					// O ❌
					// console.log('snap() case -1')

					values = [dotsCoords[0].y - 52]
					break
				case 0:
					// X ❌
					// X ❌
					// X ✅
					// O ✅
					// / ❌
					// console.log('snap() case 0')

					values = [dotsCoords[1].y - 52, dotsCoords[0].y - 52]
					break
				case 1:
					// X ❌
					// X ✅
					// O ✅
					// X ✅
					// / ❌
					// console.log('snap() case 1')

					values = [
						dotsCoords[2].y - 52,
						dotsCoords[1].y - 52,
						dotsCoords[0].y - 52,
					]
					break
				case 2:
					// X ✅
					// 0 ✅
					// X ✅
					// X ❌
					// / ❌
					// console.log('snap() case 2')

					values = [
						dotsCoords[3].y - 52,
						dotsCoords[2].y - 52,
						dotsCoords[1].y - 52,
					]
					break
				case 3:
					// O ✅
					// X ✅
					// X ❌
					// X ❌
					// / ❌
					// console.log('snap() case 3')

					values = [dotsCoords[3].y - 52, dotsCoords[2].y - 52]
					break
			}

			// console.log('Snap values:', values)

			return getClosestValue(values, value)
		},
		throwResistance: 20000,
		maxDuration: 0.6,
		overshootTolerance: 0,
		edgeResistance: 1,
		onPress() {
			set(isPressed, true)

			gsap.to(get(draggerCircleRef), {
				attr: {
					r: 54,
				},
				duration: 0.5,
				ease: 'back.out(2)',
				overwrite: true,
			})
		},
		onRelease() {
			set(isPressed, false)

			gsap.to(get(draggerCircleRef), {
				attr: {
					r: 46,
				},
				duration: 0.5,
				ease: 'back.out(3)',
				overwrite: true,
			})
		},
		onDrag() {
			update()
		},
		onDragEnd() {
			gsap.delayedCall(0.1, () => {
				translateTrackToPosition(draggableInstance[0].endY)
			})
		},
		onThrowUpdate() {
			update()
			updateCurrentStep()
		},
	})

	function update() {
		gsap.set(get(draggerMaskRef), {
			y: draggableInstance[0].y,
		})

		gsap.set(get(trackMaskInitialRef), {
			y: () => Math.max(450, draggableInstance[0].y),
		})
	}

	update()
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
	stopIdle()
})

//
// Watchers
//
watch(currentStep, (next, prev) => handleStepChange(next, prev))

watch(isIdle, idle => {
	if (idle) {
		gsap.killTweensOf(get(draggerCircleRef))

		const tl = gsap.timeline({ paused: true })
		tl.addLabel('start')

		tl.to(get(draggerCircleRef), { y: -3, duration: 0.35, ease: 'power1.out' })
		tl.to(get(draggerCircleRef), { y: 3, duration: 0.5, ease: 'power1.out' })
		tl.to(get(draggerCircleRef), { y: -3, duration: 0.5, ease: 'power1.out' })
		tl.to(get(draggerCircleRef), { y: 3, duration: 0.5, ease: 'power1.out' })
		tl.to(get(draggerCircleRef), { y: 0, duration: 0.35, ease: 'power1.inOut' })

		idleTween = gsap.fromTo(
			tl,
			{ progress: 0 },
			{
				progress: 1,
				duration: 2,
				ease: 'none',
				repeat: -1,
				repeatDelay: 2,
			}
		)
	} else {
		idleTween?.kill()
		idleTween = null

		gsap.to(get(draggerCircleRef), {
			y: 0,
			duration: 0.35,
			ease: 'sine.out',
			overwrite: true,
		})
	}
})

//
// Methods
//
const setInitialState = () => {
	gsap.set([get(headerRef), get(contentRef)], {
		autoAlpha: 0,
	})
}

const animateIn = () => {
	return gsap.fromTo(
		[get(headerRef), get(contentRef)],
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 1.2,
			stagger: 0.2,
			onComplete: () => {
				resetIdle()
			},
		}
	)
}
const handleClick = () => {
	appStore.setStep02Selection(get(currentStep))
	uiStore.setExperienceStep02Visible(false)
	uiStore.setExperienceStep03Visible(true)
}

const handleStepChange = (next, prev) => {
	let strength = 0
	let speed = 0
	let sizeMax = 0

	let radiusTop = 0
	let radiusBottom = 0

	let obstructionScale = 1
	let timeSpeed = 0

	// Initial transition
	if (prev === -1 && next === 0) {
		gsap.to(particlesOpacity, {
			value: 1,
			duration: 2,
			overwrite: true,
		})

		gsap.to(godraysOpacity, {
			value: 0.25,
			duration: 2,
			overwrite: true,
		})

		gsap.to(godraysSmoothBottom, {
			value: 0.22,
			duration: 3.5,
			overwrite: true,
		})
	}

	switch (next) {
		case 0:
			strength = 0.23
			speed = 0.1
			sizeMax = 0.035

			radiusTop = 0.4
			radiusBottom = 0.4
			break
		case 1:
			strength = 0.35
			speed = 0.16
			sizeMax = 0.048

			radiusTop = 0.5
			radiusBottom = 0.9
			break
		case 2:
			strength = 0.48
			speed = 0.21
			sizeMax = 0.056

			radiusTop = 0.8
			radiusBottom = 1.75

			obstructionScale = 0
			timeSpeed = 0.07
			break
		case 3:
			strength = 0.65
			speed = 0.26
			sizeMax = 0.065

			radiusTop = 1.2
			radiusBottom = 2.35

			obstructionScale = 0
			timeSpeed = 0.07
			break
	}

	gsap.to(particlesStrength, {
		value: strength,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(particlesSpeed, {
		value: speed,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(particlesSizeMax, {
		value: sizeMax,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysScaleTop, {
		value: radiusTop,
		duration: 1.6,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysScaleBottom, {
		value: radiusBottom,
		duration: 1.6,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysObstructionScale, {
		value: obstructionScale,
		duration: 1,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysTimeSpeed, {
		value: timeSpeed,
		duration: 1.5,
		overwrite: true,
		ease: 'sine.out',
	})
}

const updateCurrentStep = () => {
	const prevIndex = get(currentStep)
	const closest = getClosestValue(
		dotsCoords.map(dot => dot.y),
		draggableInstance[0].y + 48
	)
	const newIndex = dotsCoords.findIndex(dot => closest === dot.y)

	const index = newIndex === -1 ? prevIndex : newIndex

	set(currentStep, index)
}

const translateTrackToPosition = yPosition => {
	const snappedPosition = getClosestValue(
		dotsCoords.map(dot => dot.y),
		yPosition
	)

	const index = dotsCoords.findIndex(dot => dot.y === snappedPosition)

	gsap.to(get(trackRef), {
		yPercent: trackTranslateValues[index],
		duration: 1.5,
		ease: 'expo.out',
		overwrite: true,
	})
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center text-center;

	grid-template-areas:
		'a'
		'b'
		'c';

	grid-template-rows: auto 1fr auto;
}

.header {
	@apply flex flex-col gap-y-5 items-center justify-center;
	@apply lg:gap-y-6;

	grid-area: a;
}

.labels {
	@apply grid;

	& > * {
		@apply col-start-1 row-start-1;
	}
}

.label {
	@apply text-gold-light;
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.content {
	--mask-top-from-position: 80%;
	--mask-top-to-position: 95%;
	--mask-top-from-color: black;
	--mask-top-to-color: transparent;
	--mask-top: linear-gradient(
		to top,
		var(--mask-top-from-color) var(--mask-top-from-position),
		var(--mask-top-to-color) var(--mask-top-to-position)
	);

	--mask-bottom-from-position: 80%;
	--mask-bottom-to-position: 95%;
	--mask-bottom-from-color: black;
	--mask-bottom-to-color: transparent;
	--mask-bottom: linear-gradient(
		to bottom,
		var(--mask-bottom-from-color) var(--mask-bottom-from-position),
		var(--mask-bottom-to-color) var(--mask-bottom-to-position)
	);

	mask-image: var(--mask-bottom), var(--mask-top);
	mask-composite: intersect;
	mask-repeat: no-repeat;

	@apply grid items-center;

	grid-area: b;
}

.track-wrapper {
	@apply flex items-end justify-self-center;

	height: clamp(350px, 440px, 50svh);

	> * {
		@apply col-start-1 row-start-1;
	}
}

.track {
	@apply w-[5rem] md:w-[7.25rem];
}

.dragger-arrow {
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.instructions,
.cta {
	@apply self-center;
	@apply transition-opacity duration-500 ease-out;

	grid-area: c;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	&:is(.cta) {
		@apply delay-300;

		&[data-visible='true'] {
			@apply pointer-events-auto;
		}
	}
}
</style>
