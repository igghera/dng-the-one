<template>
	<Container class="pointer-events-none tablet-portrait:pb-16">
		<ClientOnly>
			<header class="header | text-shadow">
				<h1
					class="display-1 | golden-text uppercase"
					ref="titleRef"
					style="opacity: 0.001"
				>
					{{ $t('experience_start.title') }}
				</h1>

				<p
					class="copy | body-4 | text-gold"
					style="opacity: 0"
					v-html="$t('experience_start.copy')"
					ref="copyRef"
				/>
			</header>
		</ClientOnly>

		<ButtonGolden
			class="self-end pointer-events-auto md:portrait:-translate-y-1/2"
			size="wide"
			@click="handleClick"
			ref="buttonRef"
		>
			{{ $t('start') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { Howler } from 'howler'
import { get } from '@vueuse/core'

//
// Refs / State
//
const { gsap, SplitText } = useGSAP()

const appStore = useAppStore()
const uiStore = useUiStore()

const el = useCurrentElement()
const titleRef = useTemplateRef('titleRef')
const copyRef = useTemplateRef('copyRef')
const buttonRef = useTemplateRef('buttonRef')

const visible = useElementVisibility(el)

let split

//
// Watchers
//
watch(visible, value => {
	if (value) {
		animateIn()
	} else {
		gsap.set([get(titleRef), get(copyRef), get(buttonRef).$el], { opacity: 0 })
		split?.revert()
	}
})

//
// Methods
//
const animateIn = () => {
	split = SplitText.create(get(copyRef), {
		type: 'words,chars',
	})

	gsap.set(get(copyRef), { clearProps: 'all' })

	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.fromTo(
		get(titleRef),
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.4,
		},
		'start'
	)

	tl.fromTo(
		split.chars,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1,
			stagger: 0.04,
		},
		'>-0.2'
	)

	tl.fromTo(
		get(buttonRef).$el,
		{
			autoAlpha: 0,
		},
		{
			autoAlpha: 1,
			duration: 1.5,
		},
		'>-0.4'
	)
}

const handleClick = async () => {
	audioManager.init()

	emitter.emit(EVENTS.ANIMATE_OUT_INTRO_SHAPE)

	uiStore.setAudioButtonVisible(true)
	appStore.setAudioEnabled(true)
	Howler.volume(1)

	!audioManager.getTrack(AUDIO_LABELS.BASE_LOOP).playing() &&
		audioManager.fadeIn(AUDIO_LABELS.BASE_LOOP)

	gsap.to([get(titleRef), get(copyRef), get(buttonRef).$el], {
		opacity: 0,
		duration: 0.5,
		overwrite: true,
	})
}
</script>

<style lang="scss" scoped>
:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;
}

.header {
	@apply flex flex-col gap-y-5 items-center justify-center text-center self-start;
	@apply md:portrait:translate-y-14;
}
</style>
