<template>
	<nav class="language-selector">
		<ul class="overflow-hidden h-0" ref="ulRef">
			<li
				v-for="(locale, index) in availableLocales"
				:key="locale.code"
				class="first:rounded-t-[10px] last:rounded-b-[10px] overflow-clip"
				:class="{
					'border-gold-light/40 border-t border-solid': index > 0,
				}"
			>
				<button class="item" @click="setLocale(locale.code)">
					<span ref="labelsRefs">{{ locale.code }}</span>
				</button>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const { locale, locales, setLocale } = useI18n()
const route = useRoute()
const { gsap } = useGSAP()

const isOpen = shallowRef(false)

const el = useCurrentElement()
const ulRef = useTemplateRef('ulRef')
const labelsRefs = useTemplateRef('labelsRefs')

//
// Computed
//
const availableLocales = computed(() => {
	// Filter out locales that are not enabled for the engagement page
	if (route.name === 'engagement') {
		return get(locales).filter(curr => !ENGAGEMENT_DISABLED_LOCALES.includes(curr.code) && curr.code !== get(locale))
	}

	return get(locales).filter(curr => curr.code !== get(locale))
})

//
// Events
//
onClickOutside(
	el,
	() => {
		get(isOpen) && close()
	},
	{
		ignore: ['[data-button-language]'],
	}
)

emitter.on(EVENTS.TOGGLE_LANGUAGE_SELECTOR, () => void toggle())

//
// Methods
//
const toggle = () => {
	if (get(isOpen)) {
		close()
	} else {
		open()
	}
}

const open = () => {
	set(isOpen, true)

	const tl = gsap.timeline()
	tl.addLabel('start')

	tl.to(
		get(ulRef),
		{
			height: 'auto',
			duration: 0.5,
			ease: 'power2.out',
			overwrite: true,
		},
		'start'
	)

	tl.fromTo(
		get(labelsRefs),
		{
			autoAlpha: 0,
			yPercent: -25,
		},
		{
			autoAlpha: 1,
			stagger: 0.1,
			duration: 0.7,
			yPercent: 0,
			ease: 'power2.out',
			overwrite: true,
		},
		'start+=0.05'
	)
}

const close = () => {
	set(isOpen, false)

	gsap.to(get(ulRef), {
		height: 0,
		duration: 0.5,
		ease: 'power2.out',
		overwrite: true,
	})
}
</script>

<style lang="scss" scoped>
@use '~/assets/css/functions' as *;

.language-selector {
	@apply text-sm leading-[1.4] font-medium tracking-[0.05em] text-center relative top-full;

	width: toRem(50);
	height: toRem(50);
}

.item {
	@apply uppercase aspect-square grid items-center justify-center pointer-events-auto bg-gold/20;

	width: toRem(50);
	height: toRem(50);
}
</style>
