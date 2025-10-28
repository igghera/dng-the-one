<template>
	<Container class="pointer-events-none">
		<header
			class="flex flex-col gap-y-2 items-center justify-center text-center self-start"
		>
			<h1
				class="display-1 | golden-text uppercase"
				ref="titleRef"
				style="opacity: 0"
			>
				{{ $t('experience_start.title') }}
			</h1>

			<p
				class="copy | body-4 | text-gold-light"
				style="opacity: 0"
				v-html="$t('experience_start.copy')"
				ref="copyRef"
			/>
		</header>

		<ButtonGolden
			class="self-end pointer-events-auto"
			style="opacity: 0; visibility: hidden"
			size="wide"
			@click="handleClick"
			ref="buttonRef"
		>
			{{ $t('start') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get } from '@vueuse/core'

//
// Refs / State
//
const { gsap, SplitText } = useGSAP()

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

const handleClick = () => {
	emitter.emit(EVENTS.ANIMATE_OUT_INTRO_SHAPE)

	gsap.to([get(titleRef), get(copyRef), get(buttonRef).$el], {
		opacity: 0,
		duration: 0.5,
	})
}
</script>

<style lang="scss" scoped>
:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;
}
</style>
