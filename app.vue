<template>
	<NuxtLayout>
		<SiteHeader class="main-ui" :data-visible="uiStore.isMainUiVisible" />

		<VueLenis root ref="lenisRef" :options="lenisOptions">
			<NuxtPage />
		</VueLenis>

		<SiteFooter class="main-ui" :data-visible="uiStore.isMainUiVisible" />
	</NuxtLayout>
</template>

<script setup>
import { get, useStorage } from '@vueuse/core'

const uiStore = useUiStore()

const lenisRef = shallowRef()
const { gsap } = useGSAP()

const lenisOptions = {
	autoRaf: false,
	prevent: node => node.id === 'profiler-shell',
}

onMounted(() => {
	const state = useStorage('isFirstView', true)
	state.value = true
})

watchEffect(onInvalidate => {
	if (!get(lenisRef)?.lenis) return

	//  if using GSAP ScrollTrigger, update ScrollTrigger on scroll
	// get(lenisRef).lenis.on('scroll', ScrollTrigger.update)

	// add the Lenis requestAnimationFrame (raf) method to GSAP's ticker
	// this ensures Lenis's smooth scroll animation updates on each GSAP tick
	function update(time) {
		get(lenisRef).lenis.raf(time * 1000)

		uiStore.setResultsScrollDownVisible(get(lenisRef).lenis.animatedScroll < 20)
	}

	gsap.ticker.add(update)

	get(lenisRef).lenis.stop()
	get(lenisRef).lenis.scrollTo(0, { immediate: true, force: true })

	// disable lag smoothing in GSAP to prevent any delay in scroll animations
	gsap.ticker.lagSmoothing(0)

	// clean up GSAP's ticker from the previous execution of watchEffect, or when the effect is stopped
	onInvalidate(() => {
		gsap.ticker.remove(update)
	})
})
</script>

<style lang="scss" scoped>
.main-ui {
	@apply transition-opacity duration-1000 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}
</style>
