<template>
	<button class="button-audio" @click="handleClick" aria-label="Toggle audio">
		<svg
			class="svg"
			viewBox="0 0 22 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g class="fill-current">
				<g
					v-for="x in [0.831, 5.639, 10.447, 15.254, 20.062]"
					:key="x"
					ref="barsRef"
				>
					<rect
						:x="x"
						y="0.985596"
						width="1.2019"
						height="18.0285"
						rx="0.60095"
					/>
				</g>
			</g>
		</svg>
	</button>
</template>

<script setup>
import { Howler } from 'howler'
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const appStore = useAppStore()

const barsRef = useTemplateRef('barsRef')

const { gsap } = useGSAP()

const volume = shallowRef(0)

let barsTimelineActive = null
let barsTimelineInactive = null

//
// Lifecycle
//
onMounted(() => {
	set(volume, Howler.volume())

	gsap.set(get(barsRef), {
		transformOrigin: 'center center',
		scaleY: 0.3,
	})

	watch(
		() => appStore.isAudioEnabled,
		enabled => {
			enabled && createLoop()
			!enabled && killLoop()

			const targetVolume = enabled ? 1 : 0

			gsap.to(volume, {
				value: targetVolume,
				duration: 1,
				overwrite: true,
				onUpdate: () => {
					Howler.volume(get(volume))
				},
			})
		},
		{ immediate: true }
	)
})

//
// Methods
//
const handleClick = () => {
	appStore.setAudioEnabled(!appStore.isAudioEnabled)
}

const createLoop = () => {
	barsTimelineInactive?.kill()

	barsTimelineActive = gsap.timeline({
		repeat: -1,
	})
	barsTimelineActive.addLabel('start')

	barsTimelineActive.to(
		get(barsRef),
		{
			scaleY: 1,
			duration: 0.5,
			stagger: {
				from: 'center',
				grid: [1, 5],
				each: 0.065,
			},
			ease: 'power1.out',
		},
		'start'
	)

	barsTimelineActive.to(
		get(barsRef),
		{
			scaleY: 0.3,
			duration: 0.5,
			stagger: {
				from: 'center',
				grid: [1, 5],
				each: 0.065,
			},
			ease: 'power1.in',
		},
		'>-0.3'
	)
}

const killLoop = () => {
	barsTimelineActive?.kill()

	barsTimelineInactive = gsap.timeline()
	barsTimelineInactive.addLabel('start')

	barsTimelineInactive.to(
		get(barsRef),
		{
			scaleY: 0.3,
			duration: 0.6,
			ease: 'power1.out',
		},
		'start'
	)
}
</script>

<style lang="scss" scoped>
.button-audio {
	@apply uppercase grid items-center justify-center relative;

	&::before {
		@apply content-[''] absolute top-1/2 left-1/2 size-[50px] -translate-x-1/2 -translate-y-1/2;
		@apply md:size-[60px];
	}
}

.svg {
	@apply size-[18px] pointer-events-none relative z-[1];
	@apply md:size-[22px];
}
</style>
