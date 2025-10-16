<template>
	<Container class="pointer-events-none">
		<header class="header">
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

		<div class="content">
			<div class="track-wrapper">
				<svg
					class="track"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 96 600"
					overflow="visible"
					ref="trackRef"
				>
					<g>
						<path
							class="stroke-gold-light"
							stroke-dasharray="1.5 18"
							stroke-dashoffset="0"
							stroke-width="8"
							d="M48 0v600"
						/>
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
						transform="translate(0, 520)"
						ref="draggerRef"
					>
						<path
							class="stroke-gold-light fill-transparent"
							stroke-width="2.336"
							d="M1.284 47.994C1.284 22.393 22.04 1.64 47.641 1.64c25.601 0 46.355 20.754 46.355 46.355 0 25.602-20.754 46.356-46.355 46.357-25.602 0-46.357-20.755-46.357-46.357Z"
						/>

						<path
							class="fill-gold-light"
							d="M47.16 42.563a1.32 1.32 0 0 1 2.005 0l6.635 7.74c.734.857.126 2.18-1.002 2.18h-13.27c-1.127 0-1.736-1.323-1.002-2.18z"
						/>
					</g>

					<defs>
						<mask id="dragger-mask" transform="translate(0, 550)">
							<path
								fill="url(#dragger-gradient)"
								d="M1.284 47.994C1.284 22.393 22.04 1.64 47.641 1.64c25.601 0 46.355 20.754 46.355 46.355 0 25.602-20.754 46.356-46.355 46.357-25.602 0-46.357-20.755-46.357-46.357Z"
							/>
						</mask>

						<radialGradient id="dragger-gradient">
							<stop offset="30%" stop-color="black" />
							<stop offset="100%" stop-color="exlude" />
						</radialGradient>
					</defs>
				</svg>
			</div>
		</div>

		<p
			class="instructions | body-5 | text-gold-light"
			:data-visible="instructionsVisible"
		>
			{{ $t('experience_step_02.instructions') }}
		</p>

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

//
// Refs / State
//
// const appStore = useAppStore()
// const uiStore = useUiStore()

const { rt, tm } = useI18n()

const currentStep = shallowRef(-1)
const instructionsVisible = shallowRef(true)
const ctaVisible = shallowRef(false)

const { gsap, Draggable } = useGSAP()

const draggerRef = useTemplateRef('draggerRef')
const trackRef = useTemplateRef('trackRef')

const dotsCoords = [
	{ x: 48, y: 450 },
	{ x: 48, y: 293 },
	{ x: 48, y: 136 },
	{ x: 48, y: -17 },
]

const trackTranslateValues = [-15, 11, 37, 62]

let draggableInstance = null

//
// Computed
//
const labels = computed(() => {
	return Object.values(tm('experience_step_02.labels')).map(label => rt(label))
})

//
// Lifecycle
//
onMounted(() => {
	gsap.set(get(trackRef), {
		yPercent: trackTranslateValues[0],
	})

	draggableInstance = Draggable.create(get(draggerRef), {
		type: 'y',
		inertia: true,
		bounds: {
			top: -17 - 48,
			left: 0,
			height: 700,
			width: 96,
		},
		snap: function (value) {
			// console.log('Snap value:', value)

			let values = null

			switch (get(currentStep)) {
				case -1:
					// X ❌
					// X ❌
					// X ❌
					// X ✅
					// O ❌
					// console.log('snap() case -1')

					values = [dotsCoords[0].y - 48]
					break
				case 0:
					// X ❌
					// X ❌
					// X ✅
					// O ✅
					// / ❌
					// console.log('snap() case 0')

					values = [dotsCoords[1].y - 48, dotsCoords[0].y - 48]
					break
				case 1:
					// X ❌
					// X ✅
					// O ✅
					// X ✅
					// / ❌
					// console.log('snap() case 1')

					values = [
						dotsCoords[2].y - 48,
						dotsCoords[1].y - 48,
						dotsCoords[0].y - 48,
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
						dotsCoords[3].y - 48,
						dotsCoords[2].y - 48,
						dotsCoords[1].y - 48,
					]
					break
				case 3:
					// O ✅
					// X ✅
					// X ❌
					// X ❌
					// / ❌
					// console.log('snap() case 3')

					values = [dotsCoords[3].y - 48, dotsCoords[2].y - 48]
					break
			}

			// console.log('Snap values:', values)

			return getClosestValue(values, value)
		},
		throwResistance: 20000,
		maxDuration: 0.5,
		overshootTolerance: 0.1,
		edgeResistance: 1,
		onDrag() {
			// update()
		},
		onThrowUpdate() {
			// update()
		},
		onThrowComplete() {
			updateDraggableBounds()
			translateTrackToPosition(draggableInstance[0].y)
		},
	})

	function update() {
		console.log('update')
	}
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
})

//
// Methods
//
const handleClick = () => {
	console.log('handleClick')
}

const updateDraggableBounds = () => {
	const prevIndex = get(currentStep)
	const newIndex = dotsCoords.findIndex(
		dot => draggableInstance[0].y + 48 === dot.y
	)

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

	@screen lg {
		--mask-top-from-position: 70%;
		--mask-top-to-position: 90%;

		--mask-bottom-from-position: 70%;
		--mask-bottom-to-position: 90%;
	}

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
	@apply w-[4.5rem] lg:w-24;
}

.instructions,
.cta {
	@apply self-center;

	grid-area: c;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}
</style>
