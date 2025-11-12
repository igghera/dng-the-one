<template>
	<div class="flex flex-col gap-y-20">
		<Transition name="fade">
			<Preloader v-if="uiStore.isPreloaderVisible" />
		</Transition>

		<Experience />

		<template v-if="uiStore.isResultsVisible">
			<ExperienceResults />
			<ExperienceTimelineIntro />
		</template>

		<ClientOnly>
			<div id="stats-wrapper" v-if="isDebug"></div>
			<div id="debug-wrapper" v-if="isDebug"></div>
			<div id="eruda-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
const appStore = useAppStore()
const uiStore = useUiStore()

const { gsap } = useGSAP()

const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')

onMounted(async () => {
	if (isDebug) {
		const { default: eruda } = await import('eruda')

		eruda.init({
			container: document.getElementById('eruda-wrapper'),
			tools: ['console'],
		})
	}
})

emitter.on(EVENTS.RESTART, () => {
	emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)

	gsap.delayedCall(0.15, () => {
		uiStore.reset()
		appStore.reset()
	})
})
</script>

<style lang="scss" scoped>
.main-experience {
	@apply grid justify-center items-center;

	height: 100svh;
}

#debug-wrapper {
	@apply fixed z-[1] right-10 top-20 w-80;
}

#stats-wrapper {
	@apply fixed z-[1] left-1 top-20;
}

#eruda-wrapper {
	@apply fixed z-[1] bottom-0 w-full;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
