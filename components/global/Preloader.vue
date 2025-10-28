<template>
	<div class="preloader">
		<Logo class="w-14 md:w-28" />
	</div>
</template>

<script setup>
const { gsap } = useGSAP()
const uiStore = useUiStore()

emitter.once(EVENTS.WEBGL_READY, () => {
	gsap.delayedCall(1, () => {
		uiStore.setPreloaderVisible(false)
	})
})
</script>

<style lang="scss" scoped>
.preloader {
	@apply fixed inset-0 z-[1000] grid justify-center items-center;
}
</style>
