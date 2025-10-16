<template>
	<Container class="pointer-events-none">
		<header class="header" style="opacity: 0" ref="headerRef">
			<h2
				class="display-2 | text-gold-light"
				v-html="$t('experience_step_01.title')"
			/>
		</header>

		<div class="knob-wrapper" style="opacity: 0" ref="knobWrapperRef">
			<svg
				class="size-full"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 456 456"
				overflow="visible"
			>
				<circle
					v-for="({ x, y }, idx) in dotsCoords"
					:key="idx"
					:cx="x"
					:cy="y"
					r="6.271"
					fill="#ffdba5"
					opacity=".6"
				/>

				<!-- Sun icon -->
				<g class="sun-icon" :data-visible="!labelsVisible">
					<path
						fill="#ffffc4"
						transform="translate(0 -107)"
						d="M227.593 353.509a1.95 1.95 0 0 1 1.939 1.723l.013.229v1.952a1.95 1.95 0 0 1-1.837 1.946 1.95 1.95 0 0 1-2.053-1.718l-.014-.228v-1.952a1.954 1.954 0 0 1 1.952-1.952m12.324-4.08.184.162 1.366 1.366a1.955 1.955 0 0 1 .082 2.669 1.953 1.953 0 0 1-2.659.253l-.183-.162-1.367-1.366a1.951 1.951 0 0 1 2.378-3.059zm-22.071.162a1.953 1.953 0 0 1 .162 2.577l-.162.183-1.366 1.366a1.95 1.95 0 0 1-2.669.082 1.95 1.95 0 0 1-.253-2.658l.162-.184 1.366-1.366a1.953 1.953 0 0 1 2.76 0m-5.87-11.699a1.952 1.952 0 0 1 .229 3.891l-.229.013h-1.952a1.953 1.953 0 0 1-1.495-3.204c.32-.382.773-.627 1.267-.686l.228-.014zm33.187 0a1.95 1.95 0 0 1 1.946 1.838 1.95 1.95 0 0 1-1.718 2.053l-.228.013h-1.953a1.953 1.953 0 0 1-1.946-1.837 1.95 1.95 0 0 1 1.718-2.053l.228-.014zm-28.867-12.083.184.162 1.366 1.367a1.95 1.95 0 0 1-1.197 3.321 1.95 1.95 0 0 1-1.379-.399l-.184-.162-1.366-1.366a1.951 1.951 0 0 1 2.375-3.059zm25.171.162c.336.337.538.784.568 1.258.03.475-.114.944-.406 1.319l-.162.184-1.366 1.366a1.954 1.954 0 0 1-2.923-2.577l.162-.183 1.367-1.367a1.95 1.95 0 0 1 2.76 0m-13.874-5.647a1.95 1.95 0 0 1 1.939 1.724l.013.228v1.952a1.951 1.951 0 0 1-3.89.229l-.014-.229v-1.952a1.953 1.953 0 0 1 1.952-1.952m0 9.76a9.76 9.76 0 1 1-9.751 10.184l-.009-.424.009-.423a9.766 9.766 0 0 1 9.751-9.337"
					/>
				</g>

				<circle
					cx="228"
					cy="232.25"
					r="223.25"
					stroke="#ffffc4"
					stroke-dasharray="1.8 16"
					stroke-width="9"
					opacity=".5"
				/>

				<g mask="url(#knob-mask)">
					<circle
						cx="228"
						cy="232.25"
						r="223.25"
						stroke="#ffffc4"
						stroke-dasharray="1.8 16"
						stroke-width="15"
					/>
				</g>
			</svg>

			<svg
				class="size-full relative z-[1] pointer-events-auto overflow-visible"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 456 456"
				overflow="visible"
				ref="knobRef"
			>
				<g filter="url(#knob-glow)">
					<circle
						:cx="dotsCoords[0].x"
						:cy="dotsCoords[0].y"
						r="19.519"
						fill="#ffffc4"
					/>
				</g>

				<defs>
					<mask id="knob-mask">
						<g class="origin-center -rotate-90">
							<circle
								id="knob-track"
								cx="228"
								cy="232.25"
								r="223.25"
								stroke="white"
								stroke-width="25"
								ref="knobTrackRef"
							/>
						</g>
					</mask>

					<filter
						id="knob-glow"
						width="1000"
						height="1000"
						x="-272"
						y="-272"
						color-interpolation-filters="sRGB"
						filterUnits="userSpaceOnUse"
					>
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="4.764" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="BackgroundImageFix"
							result="effect1_dropShadow_1698_5905"
						/>
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="9.528" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="effect1_dropShadow_1698_5905"
							result="effect2_dropShadow_1698_5905"
						/>
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="33.349" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="effect2_dropShadow_1698_5905"
							result="effect3_dropShadow_1698_5905"
						/>
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="66.698" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="effect3_dropShadow_1698_5905"
							result="effect4_dropShadow_1698_5905"
						/>
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="76.247" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="effect4_dropShadow_1698_5905"
							result="effect5_dropShadow_1698_5905"
						/>
						<feColorMatrix
							in="SourceAlpha"
							result="hardAlpha"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="76.247" />
						<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
						<feBlend
							in2="effect5_dropShadow_1698_5905"
							result="effect6_dropShadow_1698_5905"
						/>
						<feBlend
							in="SourceGraphic"
							in2="effect6_dropShadow_1698_5905"
							result="shape"
						/>
					</filter>
				</defs>
			</svg>

			<div class="knob-labels">
				<span
					v-for="(label, idx) in labels"
					:key="idx"
					class="knob-label"
					:class="{
						'text-gold-light': idx < 2,
						'text-gold-dark': idx >= 2,
					}"
					:data-index="idx"
					:data-visible="idx === knobStep && labelsVisible"
					v-html="label"
				/>
			</div>
		</div>

		<p
			class="instructions | body-5 | text-gold"
			style="opacity: 0"
			:data-visible="instructionsVisible"
			ref="instructionsRef"
		>
			{{ $t('experience_step_01.instructions') }}
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

import { progress as backgroundProgress } from './WebGL/materials/background'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm } = useI18n()
const { gsap, Draggable } = useGSAP()

const headerRef = useTemplateRef('headerRef')
const knobWrapperRef = useTemplateRef('knobWrapperRef')
const knobTrackRef = useTemplateRef('knobTrackRef')
const instructionsRef = useTemplateRef('instructionsRef')

const instructionsVisible = shallowRef(true)
const ctaVisible = shallowRef(false)
const labelsVisible = shallowRef(false)

const dotsCoords = [
	{ x: 228.86, y: 64.097 },
	{ x: 396.634, y: 225.365 },
	{ x: 227.233, y: 400.802 },
	{ x: 59.694, y: 231.636 },
]

const knobRef = useTemplateRef('knobRef')
const knobStep = shallowRef(0)

const labels = computed(() => {
	return Object.values(tm('experience_step_01.labels')).map(label => rt(label))
})

let draggableInstance = null

//
// Lifecycle
//
onMounted(() => {
	animateIn()

	draggableInstance = Draggable.create(get(knobRef), {
		type: 'rotation',
		inertia: true,
		throwResistance: 50000,
		maxDuration: 0.5,
		snap(value) {
			return Math.round(value / 90) * 90
		},
		onDrag() {
			update()
		},
		onThrowUpdate() {
			update()
		},
	})

	function update() {
		const { rotation } = draggableInstance[0]

		let step = Math.round(rotation / 90) % 4
		if (Math.sign(step) === -1) step = 4 + step
		set(knobStep, Math.abs(step))

		let bg = rotation % 360
		if (Math.sign(bg) === -1) bg = 360 + bg
		backgroundProgress.value = bg / 360

		const start = 0
		const end = (bg / 360) * 100

		gsap.set(get(knobTrackRef), {
			drawSVG: `${start}% ${end}%`,
		})
	}

	update()
})

onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
})

//
// Methods
//
const animateIn = () => {
	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.fromTo(
		[get(headerRef), get(knobWrapperRef), get(instructionsRef)],
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 1.2,
			ease: 'power1.out',
			stagger: 0.1,
			onComplete: () => {
				gsap.set([get(headerRef), get(knobWrapperRef), get(instructionsRef)], {
					clearProps: 'all',
				})
			},
		},
		'start'
	)

	tl.call(
		() => {
			set(labelsVisible, true)
			set(instructionsVisible, false)
			set(ctaVisible, true)
		},
		null,
		'>0.7'
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
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.instructions,
.cta {
	@apply self-start;
	@apply transition-opacity duration-500 ease-out;

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
