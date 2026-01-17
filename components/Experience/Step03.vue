<template>
	<Container class="pointer-events-none">
		<header class="header | text-shadow" ref="headerRef">
			<h2
				class="display-2 | golden-text"
				v-html="$t('experience_step_03.title')"
			/>
		</header>

		<div class="content">
			<div
				v-for="(label, idx) in labels"
				style="opacity: 0.001"
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
					<image
						href="/images/glowing-dot.webp"
						width="240"
						height="240"
						transform="translate(-104, -104)"
					/>
				</svg>

				<span
					class="dragger-label | text-shadow"
					data-dragger-label
					ref="draggersLabelsRef"
					>{{ label }}</span
				>
			</div>

			<svg
				class="dropzone"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 98 115"
				ref="dropzoneRef"
				overflow="visible"
			>
				<g ref="dropzoneCircleWrapperRef">
					<circle
						class="stroke-gold-light"
						style="opacity: 0.001"
						cx="48"
						cy="66"
						r="46"
						stroke-width="2"
						stroke="red"
						fill="transparent"
						data-dropzone-circle
						data-default-radius="46"
						ref="dropzoneCircleRef"
					/>
				</g>

				<g class="dropzone-arrow-wrapper">
					<path
						class="fill-gold-light"
						data-dropzone-arrow
						d="M52.539 28.935a.843.843 0 1 1 1.192 1.192l-4.5 4.5a.844.844 0 0 1-1.192 0l-4.5-4.5a.846.846 0 0 1-.022-1.214.846.846 0 0 1 1.214.022l3.06 3.06V.844a.843.843 0 1 1 1.688 0v31.15z"
						ref="dropzoneArrowRef"
					/>
				</g>

				<g
					id="dot-wrapper-step-03"
					transform="translate(49, 64)"
					ref="dotWrapperStep03Ref"
				></g>
			</svg>
		</div>

		<p
			v-html="$t('experience_step_03.instructions')"
			class="instructions | body-5 | text-gold-light text-shadow"
			style="opacity: 0.001"
			ref="instructionsRef"
		/>
	</Container>
</template>

<script setup>
import { get, useStorage } from '@vueuse/core'
import slugify from 'voca/slugify'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()
const trackingStore = useTrackingStore()

const storage = useStorage('experience-answers', {})

const { rt, tm } = useI18n()
const { gsap, Draggable, Flip } = useGSAP()

const { isPortrait } = useViewport()

const el = useCurrentElement()
const headerRef = useTemplateRef('headerRef')
const instructionsRef = useTemplateRef('instructionsRef')
const draggersRef = useTemplateRef('draggersRef')
const draggersLabelsRef = useTemplateRef('draggersLabelsRef')
const dropzoneRef = useTemplateRef('dropzoneRef')
const dropzoneCircleWrapperRef = useTemplateRef('dropzoneCircleWrapperRef')
const dropzoneCircleRef = useTemplateRef('dropzoneCircleRef')
const dropzoneArrowRef = useTemplateRef('dropzoneArrowRef')
const dotWrapperStep03Ref = useTemplateRef('dotWrapperStep03Ref')

const labels = computed(() => {
	return Object.values(tm('experience_step_03.labels')).map(label => rt(label))
})

const labelsEN = Object.freeze(['Masculine', 'Feminine', "I don't care"])

let draggableInstance = null

//
// Lifecycle
//
onMounted(async () => {
	setInitialState()

	trackingStore.setFunnel('4')

	await animateIn()

	uiStore.setBackButtonVisible(true)
})

onBeforeUnmount(() => {
	draggableInstance.forEach(instance => instance.kill())
})

//
// Events
//
emitter.on(EVENTS.BACK, () => {
	if (!uiStore.isExperienceStep03Visible) return

	back()
})

//
// Methods
//
const setInitialState = () => {
	gsap.set(
		[
			get(draggersLabelsRef),
			get(dropzoneArrowRef),
			get(headerRef),
			get(instructionsRef),
		],
		{
			opacity: 0,
		}
	)

	gsap.set(get(dotWrapperStep03Ref), { clearProps: 'all' })
	gsap.set(get(dropzoneCircleRef), { drawSVG: '0% 0%', clearProps: 'opacity' })
	gsap.set(get(dropzoneCircleWrapperRef), { transformOrigin: 'center' })
}

const animateIn = () => {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	// Fade in header
	tl.to(
		get(headerRef),
		{
			opacity: 1,
			duration: 1.5,
		},
		'start'
	)

	// Fade in dots
	tl.to(
		get(draggersRef),
		{
			opacity: 1,
			duration: 1,
		},
		'>-0.4'
	)

	// Move draggers to final positions
	tl.add(
		() => {
			const state = Flip.getState(get(draggersRef))

			get(draggersRef).forEach(dragger => {
				dragger.classList.add('is-final-position')
			})

			Flip.from(state, {
				duration: 1.7,
				ease: 'power3.inOut',
				stagger: 0.18,
				onStart: () => {
					audioManager.play(AUDIO_LABELS.SFX_STEP_03_ANIMATE_IN)

					gsap.set(get(dotWrapperStep03Ref), {
						opacity: 0,
						duration: 0.4,
					})
				},
				onComplete: () => {
					pulseDraggers()
				},
			})
		},
		null,
		'>0.7'
	)

	// Animate in dropzone circle
	tl.to(
		get(dropzoneCircleWrapperRef),
		{ rotation: 290, duration: 2, ease: 'power2.out' },
		'>0.75'
	)
	tl.to(get(dropzoneCircleRef), { drawSVG: '0% 100%', duration: 2 }, '<')

	// Fade in dropzone arrow
	tl.to(
		get(dropzoneArrowRef),
		{
			opacity: 1,
			duration: 1.2,
		},
		'>0.55'
	)

	// Fade in instructions
	tl.to(
		get(instructionsRef),
		{
			opacity: 1,
			duration: 1.5,
		},
		'<0.1'
	)

	// Fade in labels
	tl.to(
		get(draggersLabelsRef),
		{
			opacity: 1,
			duration: 1.5,
			stagger: 0.12,
		},
		'<0.7'
	)

	tl.call(
		() => {
			createDraggable()
		},
		null,
		'<'
	)

	return tl.play()
}

const pulseDraggers = () => {
	const dropzoneBounds = get(dropzoneRef).getBoundingClientRect()
	const dropzoneCenter = {
		x: dropzoneBounds.left + dropzoneBounds.width / 2,
		y: dropzoneBounds.top + dropzoneBounds.height / 2,
	}

	const draggersCenters = get(draggersRef).map(dragger => {
		const draggerBounds = dragger.getBoundingClientRect()

		return {
			x: draggerBounds.left + draggerBounds.width / 2,
			y: draggerBounds.top + draggerBounds.height / 2,
		}
	})

	const directions = draggersCenters.map(center => {
		return {
			x: dropzoneCenter.x - center.x,
			y: dropzoneCenter.y - center.y,
		}
	})

	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.to(get(draggersRef), {
		x: index => {
			const dir = directions[index]
			return `+=${dir.x * 0.1}`
		},
		y: index => {
			const dir = directions[index]
			return `+=${dir.y * 0.1}`
		},
		duration: 0.65,
		stagger: 0.1,
		ease: 'power1.inOut',
		repeat: 1,
		yoyo: true,
	})
}

const back = async () => {
	uiStore.setBackButtonVisible(false)

	draggableInstance.forEach(instance => instance.kill())

	await animateBack()

	uiStore.setExperienceStep02Visible(true)

	await nextTick()

	const svgImage = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'image'
	)
	svgImage.setAttribute('id', 'glowing-dot')
	svgImage.setAttribute('href', '/images/glowing-dot.webp')
	svgImage.setAttribute('width', '345')
	svgImage.setAttribute('height', '345')
	svgImage.setAttribute('transform', 'matrix(0.85,0,0,0.85,-146.625,-146.625)')
	svgImage.style.opacity = 0
	document.getElementById('dot-wrapper-step-02').appendChild(svgImage)

	gsap.to(svgImage, {
		opacity: 1,
		duration: 1,
	})

	uiStore.setExperienceStep03Visible(false)

	await nextTick()

	emitter.emit(EVENTS.EXPERIENCE_STEP_02_POSITION_TRACK_START, { back: true })
}

const animateBack = () => {
	return gsap.to(get(el), {
		autoAlpha: 0,
		duration: 0.8,
	})
}

const createDraggable = () => {
	draggableInstance = Draggable.create(get(draggersRef), {
		minimumMovement: 5,
		onClick: self => {
			const idx = Number(self.target.dataset.index)

			fadeOutDraggers(idx)

			appStore.setStep03Selection(idx)
			moveToFinalPosition(self.target)
			storage.value.q3 = idx
		},
		onDragStart: self => {
			const idx = Number(self.target.dataset.index)

			fadeOutDraggers(idx)

			zoomInDropzoneCircle()
		},
		onDragEnd: self => {
			zoomOutDropzoneCircle()

			const inDropzone = Draggable.hitTest(self.target, get(dropzoneRef), '1%')
			const idx = Number(self.target.dataset.index)

			if (inDropzone) {
				appStore.setStep03Selection(idx)
				moveToFinalPosition(self.target)
				storage.value.q3 = idx
			} else {
				fadeInDraggers(idx)
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
		audioManager.play(AUDIO_LABELS.SFX_CLICK)

		Tracking.sendEvent({
			generic_event_and_label: 'drag_and_drop_into_the_circle',
			customizator_option: slugify(labelsEN[appStore.getStep03Selection]),
		})

		uiStore.setBackButtonVisible(false)

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
				if (!uiStore.isExperienceStep03Visible) return

				uiStore.setExperienceEndVisible(true)

				if (!uiStore.isExperienceStep03Visible) return

				startPulseAnimation()

				emitter.once(EVENTS.EXPERIENCE_END_DRAW_ANIMATION_START, async () => {
					const target = get(draggersRef)[appStore.getStep03Selection]

					if (!target) return

					const img = target.querySelector('image')
					gsap.killTweensOf(img)

					await gsap.to(target, {
						opacity: 0,
						duration: 0.5,
					})

					uiStore.setExperienceStep03Visible(false)
				})
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

	function fadeOutDraggers(idx) {
		const targetDraggers = get(draggersRef).filter(
			(item, index) => index !== idx
		)
		gsap.to(targetDraggers, {
			autoAlpha: 0,
			duration: 0.5,
			overwrite: true,
			stagger: 0.1,
		})
	}

	function fadeInDraggers() {
		gsap.to(get(draggersRef), {
			autoAlpha: 1,
			duration: 0.5,
			overwrite: true,
		})
	}
}

const startPulseAnimation = () => {
	const target = get(draggersRef)[appStore.getStep03Selection]

	const img = target.querySelector('image')

	gsap.set(img, { transformOrigin: 'center center' })

	gsap.to(img, {
		scale: 0.7,
		yoyo: true,
		repeat: -1,
		duration: 0.5,
		ease: 'sine.inOut',
	})
}

const zoomInDropzoneCircle = () => {
	const defaultRadius = Number(get(dropzoneCircleRef).dataset.defaultRadius)

	gsap.to(get(dropzoneCircleRef), {
		attr: {
			r: () => defaultRadius + 5,
		},
		duration: 0.8,
		ease: 'expo.out',
		overwrite: true,
	})
}

const zoomOutDropzoneCircle = () => {
	const defaultRadius = Number(get(dropzoneCircleRef).dataset.defaultRadius)

	gsap.to(get(dropzoneCircleRef), {
		attr: {
			r: defaultRadius,
		},
		duration: 1,
		ease: 'expo.out',
		overwrite: true,
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
		'b'
		'c';
	grid-template-rows: auto 1fr auto;
}

.header {
	@apply text-center uppercase;

	grid-area: a;
}

.content {
	@apply grid w-full self-center;

	grid-area: b;

	@media (min-width: 550px) {
		@apply aspect-[260/290] w-auto;
	}

	@screen portrait {
		@apply h-[70%];

		@screen md {
			@apply h-3/5;
		}
	}

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

	&:not(.is-final-position) {
		@apply self-center justify-self-center translate-y-2;
		@apply landscape:self-end landscape:-translate-y-4;
	}

	&.is-final-position {
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
	@apply self-start text-center;
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
