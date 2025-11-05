<template>
	<Container class="pointer-events-none">
		<header class="header" ref="headerRef">
			<h2
				class="display-2 | golden-text"
				v-html="$t('experience_step_03.title')"
			/>
		</header>

		<div class="content">
			<div
				v-for="(label, idx) in labels"
				:key="idx"
				class="dragger"
				:data-index="idx"
				ref="draggersRef"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 32 32"
					class="w-6 landscape:w-8 relative z-[1] row-start-1 col-start-1"
					overflow="visible"
				>
					<g filter="url(#dot-glow)">
						<circle cx="16" cy="16" r="16" class="fill-gold-light" />
					</g>
				</svg>

				<span class="dragger-label" data-dragger-label>{{ label }}</span>
			</div>

			<svg
				class="dropzone"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 98 115"
				ref="dropzoneRef"
			>
				<path
					class="stroke-gold-light"
					stroke-width="2.336"
					data-dropzone-circle
					d="M1.168 65.653c0-26.225 21.26-47.486 47.485-47.486 26.226 0 47.487 21.26 47.487 47.486S74.879 113.14 48.653 113.14c-26.225 0-47.485-21.26-47.485-47.486Z"
				/>

				<g class="dropzone-arrow-wrapper">
					<path
						class="fill-gold-light"
						data-dropzone-arrow
						d="M52.539 28.935a.843.843 0 1 1 1.192 1.192l-4.5 4.5a.844.844 0 0 1-1.192 0l-4.5-4.5a.846.846 0 0 1-.022-1.214.846.846 0 0 1 1.214.022l3.06 3.06V.844a.843.843 0 1 1 1.688 0v31.15z"
					/>
				</g>
			</svg>
		</div>

		<p class="instructions | body-5 | text-gold-light" ref="instructionsRef">
			{{ $t('experience_step_03.instructions') }}
		</p>

		<svg
			class="row-start-1 row-end-4 col-start-1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<filter
					id="dot-glow"
					width="280"
					height="280"
					x="-140"
					y="-140"
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
					<feGaussianBlur stdDeviation="4" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="BackgroundImageFix"
						result="effect1_dropShadow_1872_11139"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="7.9" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="effect1_dropShadow_1872_11139"
						result="effect2_dropShadow_1872_11139"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="27.7" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="effect2_dropShadow_1872_11139"
						result="effect3_dropShadow_1872_11139"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="55.4" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="effect3_dropShadow_1872_11139"
						result="effect4_dropShadow_1872_11139"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="63.4" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="effect4_dropShadow_1872_11139"
						result="effect5_dropShadow_1872_11139"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset />
					<feGaussianBlur stdDeviation="63.4" />
					<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
					<feBlend
						in2="effect5_dropShadow_1872_11139"
						result="effect6_dropShadow_1872_11139"
					/>
					<feBlend
						in="SourceGraphic"
						in2="effect6_dropShadow_1872_11139"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	</Container>
</template>

<script setup>
import { get } from '@vueuse/core'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm } = useI18n()
const { gsap, Draggable, Flip } = useGSAP()

const { isPortrait } = useViewport()

const headerRef = useTemplateRef('headerRef')
const instructionsRef = useTemplateRef('instructionsRef')
const draggersRef = useTemplateRef('draggersRef')
const dropzoneRef = useTemplateRef('dropzoneRef')

const labels = computed(() => {
	return Object.values(tm('experience_step_03.labels')).map(label => rt(label))
})

let draggableInstance = null

//
// Lifecycle
//
onMounted(() => {
	draggableInstance = Draggable.create(get(draggersRef), {
		onDragEnd: self => {
			const inDropzone = Draggable.hitTest(self.target, get(dropzoneRef), '1%')

			if (inDropzone) {
				moveToFinalPosition(self.target)
				appStore.setStep03Selection(Number(self.target.dataset.index))
			} else {
				moveToInitialPosition(self.target)
			}
		},
	})

	function moveToInitialPosition(elem) {
		const state = Flip.getState(elem)

		gsap.set(elem, { clearProps: 'transform' })

		Flip.from(state, {
			duration: 0.5,
			ease: 'power1.out',
			overwrite: true,
		})
	}

	function moveToFinalPosition(elem) {
		// Kill all Draggable instances
		for (const draggable of draggableInstance) {
			draggable.kill()
		}

		// Get other items
		const otherElems = draggableInstance.reduce((acc, draggable) => {
			if (draggable.target !== elem) {
				acc.push(draggable.target)
			}

			return acc
		}, [])

		const state = Flip.getState(elem)

		gsap.set(elem, {
			alignSelf: () => (get(isPortrait) ? 'center' : 'end'),
			justifySelf: () => 'center',
			x: 0,
			y: 0,
			yPercent: () => (get(isPortrait) ? 5 : -25),
		})

		const tl = gsap.timeline({
			onComplete: () => {
				uiStore.setExperienceStep03Visible(false)
				uiStore.setExperienceEndVisible(true)
			},
		})
		tl.addLabel('start')

		// Fade out other items
		tl.to(
			otherElems,
			{
				autoAlpha: 0,
				stagger: 0.1,
				duration: 0.8,
			},
			'start'
		)

		// Move selected item to dropzone's center
		tl.add(
			Flip.from(state, {
				duration: 1.5,
				ease: 'expo.out',
			}),
			'start'
		)

		// Fade out selected item's label
		tl.to(
			[
				elem.querySelector('[data-dragger-label]'),
				get(dropzoneRef).querySelector('[data-dropzone-arrow]'),
			],
			{
				autoAlpha: 0,
				duration: 0.5,
			},
			'start+=0.3'
		)

		tl.to(
			[get(headerRef), get(instructionsRef)],
			{
				autoAlpha: 0,
				stagger: 0.15,
				duration: 0.8,
			},
			'>0.5'
		)

		tl.to(
			get(dropzoneRef).querySelector('[data-dropzone-circle]'),
			{
				opacity: 0,
				duration: 0.8,
			},
			'<0.5'
		)
	}
})

//
// Methods
//
const animateIn = () => {}
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

.content {
	@apply grid aspect-[260/290] self-center h-4/5 max-w-full;

	grid-area: b;

	@screen landscape {
		@apply aspect-[860/310] h-auto;

		width: min(100%, toRem(860));
	}

	> * {
		@apply col-start-1 row-start-1;
	}
}

.dragger {
	@apply aspect-square size-16 inline-grid items-center justify-items-center pointer-events-auto relative z-[1];

	grid-template-rows:
		theme('spacing.16')
		1fr;
	grid-template-columns: 1fr;

	&[data-index='0'] {
		@apply self-start justify-self-start;
		@apply landscape:translate-y-full;
	}

	&[data-index='1'] {
		@apply self-start justify-self-end;
		@apply landscape:translate-y-full;
	}

	&[data-index='2'] {
		@apply self-end justify-self-center;
		@apply landscape:self-start;
	}

	& > * {
		@apply pointer-events-none;
	}
}

.dragger-label {
	@apply text-base leading-none tracking-[0.05em] text-gold-light absolute top-full left-1/2 -translate-x-1/2 text-center w-[200%];
}

.dropzone {
	@apply self-center justify-self-center;

	width: toRem(72);

	@screen landscape {
		@apply w-24 self-end;
	}
}

.dropzone-arrow-wrapper {
	animation-name: bounce;
	animation-duration: 1s;
	animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
	animation-iteration-count: infinite;
	animation-direction: alternate;
	animation-fill-mode: both;
}

.instructions {
	@apply self-start;
	@apply transition-opacity duration-500 ease-out;

	grid-area: c;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	&[data-visible='true'] {
		@apply pointer-events-auto;
	}
}

@keyframes bounce {
	0% {
		transform: translateY(0px);
	}

	100% {
		transform: translateY(10px);
	}
}
</style>
