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
					<g v-if="false" id="step-02-content-mask">
						<rect x="-300" y="0" width="716" height="2000" fill="black" />

						<rect
							style="transform-box: fill-box; transform-origin: center"
							x="-300"
							y="10"
							width="716"
							height="800"
							fill="url(#step-02-content-gradient-init)"
							fill-opacity="1"
							ref="contentMaskRectInitRef"
						/>

						<rect
							style="transform-box: fill-box; transform-origin: center"
							x="-300"
							y="10"
							width="716"
							height="800"
							fill="url(#step-02-content-gradient-final)"
							fill-opacity="1"
							ref="contentMaskRectFinalRef"
						/>
					</g>

					<g mask="url(#step-02-content-mask)">
						<!-- DO NOT DELETE: Filler element to avoid clipping issues -->
						<rect
							x="-300"
							y="-200"
							width="716"
							height="1000"
							fill="transparent"
						/>

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
							<g
								v-for="(dot, idx) in dotsCoords"
								:key="idx"
								:transform="`translate(${dot.x}, ${dot.y})`"
							>
								<circle
									class="fill-gold-light"
									cx="0"
									cy="0"
									r="10"
									ref="dotsRef"
								/>
							</g>
						</g>

						<g
							class="dragger | pointer-events-auto"
							transform="translate(0, 579)"
							ref="draggerRef"
						>
							<g ref="draggerCircleWrapperRef">
								<circle
									class="stroke-gold-light fill-transparent"
									cx="58"
									cy="55"
									r="46"
									stroke-width="2"
									ref="draggerCircleRef"
								/>

								<g class="arrows">
									<g
										class="dragger-arrow"
										transform="translate(48, -14)"
										:data-visible="
											currentStep < 3 && !isPressed && arrowsVisible
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
										:data-visible="
											currentStep > 0 && !isPressed && arrowsVisible
										"
									>
										<path
											class="fill-gold-light"
											d="M9.658.792a.5.5 0 0 1 .759 0l8.644 10.085a.5.5 0 0 1-.38.825H1.394a.5.5 0 0 1-.38-.825z"
										/>
									</g>
								</g>
							</g>

							<g
								transform="translate(58, 52)"
								class="!visible"
								id="dot-wrapper-step-02"
							></g>
						</g>
					</g>

					<defs>
						<mask id="dragger-mask">
							<rect
								x="0"
								y="-100"
								width="116"
								height="700"
								fill="white"
								fill-opacity="1"
								ref="draggerMaskRectRef"
							/>

							<g ref="draggerMaskRef">
								<circle cx="58" cy="58" r="58" fill="black" fill-opacity="1" />
							</g>

							<g transform="translate(0, 550)" ref="trackMaskInitialRef">
								<rect x="0" y="0" width="116" height="300" fill="black"></rect>
							</g>
						</mask>

						<radialGradient id="dragger-gradient">
							<stop offset="50%" stop-color="black" />
							<stop offset="100%" stop-color="white" />
						</radialGradient>

						<mask id="step-02-content-mask" ref="contentMaskRef">
							<rect x="-300" y="10" width="716" height="2000" fill="black" />

							<rect
								style="transform-box: fill-box; transform-origin: center"
								x="-300"
								y="10"
								width="716"
								height="800"
								fill="url(#step-02-content-gradient-init)"
								fill-opacity="1"
								ref="contentMaskRectInitRef"
							/>

							<rect
								style="transform-box: fill-box; transform-origin: center"
								x="-300"
								y="10"
								width="716"
								height="800"
								fill="url(#step-02-content-gradient-final)"
								fill-opacity="1"
								ref="contentMaskRectFinalRef"
							/>
						</mask>

						<linearGradient
							id="step-02-content-gradient-init"
							gradientTransform="rotate(90)"
						>
							<stop offset="0%" stop-color="black" />
							<stop offset="28%" stop-color="black" />
							<stop offset="40%" stop-color="white" />
							<stop offset="100%" stop-color="white" />
						</linearGradient>

						<linearGradient
							id="step-02-content-gradient-final"
							gradientTransform="rotate(90)"
						>
							<stop offset="0%" stop-color="black" />
							<stop offset="24%" stop-color="black" />
							<stop offset="36%" stop-color="white" />
							<stop offset="73%" stop-color="white" />
							<stop offset="85%" stop-color="black" />
							<stop offset="100%" stop-color="black" />
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>

		<div class="cta-wrapper" ref="ctaWrapperRef">
			<div
				class="instructions | text-shadow"
				:data-visible="instructionsVisible && currentStep === -1"
			>
				<p class="instructions-inner pulse-100-60 | body-5 | text-gold-light">
					{{ $t('experience_step_02.instructions') }}
				</p>
			</div>

			<ButtonGolden
				class="cta | !text-gold"
				size="wide"
				:data-visible="currentStep >= 0"
				@click.once="handleClick"
			>
				{{ $t('select') }}
			</ButtonGolden>
		</div>
	</Container>
</template>

<script setup>
import { get, set, useStorage } from '@vueuse/core'
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
const instructionsVisible = shallowRef(false)
const arrowsVisible = shallowRef(false)

const storage = useStorage('experience-answers', {})

const { idle: isIdle, reset: resetIdle, stop: stopIdle } = useIdle(2500)

const { gsap, Draggable, Flip } = useGSAP()

const headerRef = useTemplateRef('headerRef')
const draggerRef = useTemplateRef('draggerRef')
const contentMaskRectInitRef = useTemplateRef('contentMaskRectInitRef')
const contentMaskRectFinalRef = useTemplateRef('contentMaskRectFinalRef')
const draggerCircleWrapperRef = useTemplateRef('draggerCircleWrapperRef')
const draggerCircleRef = useTemplateRef('draggerCircleRef')
const draggerMaskRef = useTemplateRef('draggerMaskRef')
const draggerMaskRectRef = useTemplateRef('draggerMaskRectRef')
const dotsRef = useTemplateRef('dotsRef')
const trackRef = useTemplateRef('trackRef')
const trackMaskInitialRef = useTemplateRef('trackMaskInitialRef')
const ctaWrapperRef = useTemplateRef('ctaWrapperRef')

const { height: trackHeight } = useElementBounding(trackRef)

const dotsCoords = [
	{ x: 58, y: 450 },
	{ x: 58, y: 293 },
	{ x: 58, y: 136 },
	{ x: 58, y: -17 },
]

// const trackTranslateValues = [-15, 11, 37, 62]
const trackTranslateValues = [-35, -4, 22, 47]

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

	emitter.once(EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_START, async () => {
		// console.log('✅ received: EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_START')

		gsap.set(get(trackRef), {
			yPercent: trackTranslateValues[0],
		})

		await nextTick()

		// console.log('▶️ emitted: EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_COMPLETE')
		emitter.emit(EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_COMPLETE)
	})

	emitter.once(EVENTS.EXPERIENCE_STEP_02_DOT_ANIMATE_IN_COMPLETE, async () => {
		// console.log(
		// 	'✅ received: EVENTS.EXPERIENCE_STEP_02_DOT_ANIMATE_IN_COMPLETE'
		// )

		await animateIn()

		createDraggable()
	})
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
	stopIdle()
})

//
// Events
//
emitter.on(EVENTS.RESTART, () => {
	draggableInstance?.[0]?.kill()
	stopIdle()

	gsap.killTweensOf([get(draggerMaskRef), get(trackRef)])
})

//
// Watchers
//
watch(currentStep, (next, prev) => handleStepChange(next, prev))

watch(isIdle, idle => {
	if (idle) {
		gsap.killTweensOf(get(draggerCircleWrapperRef))

		const tl = gsap.timeline({ paused: true })
		tl.addLabel('start')

		tl.to(get(draggerCircleWrapperRef), {
			y: -3,
			duration: 0.35,
			ease: 'power1.out',
		})
		tl.to(get(draggerCircleWrapperRef), {
			y: 3,
			duration: 0.5,
			ease: 'power1.out',
		})
		tl.to(get(draggerCircleWrapperRef), {
			y: -3,
			duration: 0.5,
			ease: 'power1.out',
		})
		tl.to(get(draggerCircleWrapperRef), {
			y: 3,
			duration: 0.5,
			ease: 'power1.out',
		})
		tl.to(get(draggerCircleWrapperRef), {
			y: 0,
			duration: 0.35,
			ease: 'power1.inOut',
		})

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

		gsap.to(get(draggerCircleWrapperRef), {
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
	gsap.set([get(headerRef), get(dotsRef), get(draggerCircleRef)], {
		visibility: 'hidden',
	})

	gsap.set([get(draggerMaskRectRef), get(contentMaskRectFinalRef)], {
		attr: {
			'fill-opacity': 0,
		},
	})

	gsap.set(get(draggerMaskRef), {
		y: 577,
	})

	// gsap.set(get(contentMaskRectInitRef), {
	// 	scale: 2,
	// })

	set(instructionsVisible, false)
}

const animateIn = () => {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.fromTo(
		[get(headerRef), get(dotsRef), get(draggerCircleRef)],
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 1.2,
			stagger: 0.15,
			onComplete: () => {
				set(instructionsVisible, true)
				set(arrowsVisible, true)
				resetIdle()
			},
		},
		'start'
	)

	tl.to(
		get(draggerMaskRectRef),
		{
			attr: {
				'fill-opacity': 1,
			},
			duration: 1,
		},
		'start+=0.2'
	)

	// tl.to(
	// 	get(contentMaskRectInitRef),
	// 	{
	// 		scale: 1,
	// 		duration: 1.2,
	// 		ease: 'power1.out',
	// 	},
	// 	'start+=0.3'
	// )

	return tl.play()
}

const animateOut = async () => {
	const tl = gsap.timeline({
		paused: true,
		onStart: () => {
			set(arrowsVisible, false)
		},
	})
	tl.addLabel('start')

	tl.to(
		[get(headerRef), get(dotsRef), get(draggerCircleRef), get(ctaWrapperRef)],
		{
			opacity: 0,
			duration: 1,
		},
		'start'
	)

	tl.to(
		[get(draggerMaskRectRef), get(draggerMaskRef).querySelector('circle')],
		{
			attr: {
				'fill-opacity': 0,
			},
			duration: 1,
		},
		'start'
	)

	return tl.play()
}

const moveDotToNextPosition = async () => {
	const dot = document.getElementById('glowing-dot')
	const state = Flip.getState(dot)

	document.getElementById('dot-wrapper-step-03').appendChild(dot)

	return Flip.from(state, {
		duration: 1.6,
		ease: 'power3.inOut',
	})
}

const handleClick = async () => {
	draggableInstance?.[0]?.kill()

	await animateOut()

	appStore.setStep02Selection(get(currentStep))
	storage.value.q2 = get(currentStep)

	uiStore.setExperienceStep03Visible(true)

	await nextTick()

	await moveDotToNextPosition()

	uiStore.setExperienceStep02Visible(false)
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
		onUpdate: () => {
			const translateYPercent = gsap.getProperty(get(trackRef), 'yPercent')
			const value = get(trackHeight) * (translateYPercent / 100)

			gsap.set([get(contentMaskRectInitRef), get(contentMaskRectFinalRef)], {
				attr: {
					y: () => -200 - value,
				},
			})
		},
	})
}

const createDraggable = () => {
	draggableInstance = Draggable.create(get(draggerRef), {
		type: 'y',
		inertia: true,
		edgeResistance: 1,
		bounds: {
			top: -17 - 48 - 18,
			left: 0,
			height: 1060,
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
		onThrowComplete() {
			gsap.set(get(contentMaskRectFinalRef), {
				attr: {
					'fill-opacity': 1,
				},
			})
		},
	})

	function update() {
		if (!draggableInstance?.[0]) return

		gsap.set(get(draggerMaskRef), {
			y: draggableInstance[0].y - 2,
		})

		gsap.set(get(trackMaskInitialRef), {
			y: () => Math.max(450, draggableInstance[0].y),
		})
	}

	update()
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
	@apply grid items-center;

	grid-area: b;
}

.track-wrapper {
	@apply grid items-center justify-self-center;

	height: clamp(350px, 440px, 50svh);

	> * {
		@apply col-start-1 row-start-1 relative z-[1];
	}

	&::after {
		@apply relative content-[''] block size-full col-start-1 row-start-1 origin-center scale-150;
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

.cta-wrapper {
	@apply grid items-center justify-center;

	grid-area: c;
}

.instructions,
.cta {
	@apply self-center col-start-1 row-start-1;
	@apply transition-opacity duration-500 ease-out;

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
