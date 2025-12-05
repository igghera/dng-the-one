<template>
	<div class="preloader">
		<Logo class="w-14 md:w-28" />
	</div>
</template>

<script setup>
const { gsap } = useGSAP()
const uiStore = useUiStore()

emitter.on(EVENTS.WEBGL_READY, () => {
	gsap.delayedCall(1, () => {
		uiStore.setPreloaderVisible(false)
		emitter.emit(EVENTS.ANIMATE_IN_INTRO)
	})
})
</script>

<style lang="scss" scoped>
.preloader {
	@apply fixed inset-0 z-[1000] grid justify-center items-center;
}
</style>
