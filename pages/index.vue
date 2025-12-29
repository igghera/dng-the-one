<template>
	<div class="flex flex-col gap-y-20">
		<Transition name="fade">
			<Preloader v-if="uiStore.isPreloaderVisible" />
		</Transition>

		<Experience />

		<Transition name="fade">
			<ExperienceTopGradient v-if="uiStore.isTopGradientVisible" />
		</Transition>

		<Transition name="fade-from-bottom">
			<ExperienceBottomGradient v-if="uiStore.isBottomGradientVisible" />
		</Transition>

		<Transition name="fade">
			<ExperienceScrollDown
				v-if="uiStore.isResultsVisible && uiStore.isResultsScrollDownVisible"
			/>
		</Transition>

		<template v-if="uiStore.isResultsVisible">
			<ExperienceResults />

			<ExperienceTimelineIntro cta-link="/explore" />
		</template>

		<Transition name="fade">
			<ModalQRCode
				v-if="uiStore.isQrCodeModalVisible && config.public.isAppMode"
			/>
		</Transition>

		<Transition name="fade">
			<ModalConfiguration
				v-if="uiStore.isConfigPanelVisible && config.public.isAppMode"
			/>
		</Transition>

		<ClientOnly>
			<div id="stats-wrapper" v-if="isDebug"></div>
			<div id="debug-wrapper" v-if="isDebug"></div>
			<div id="eruda-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
import { get } from '@vueuse/core'

const config = useRuntimeConfig()
const appStore = useAppStore()
const uiStore = useUiStore()
const trackingStore = useTrackingStore()

const lenis = useLenis()

const { gsap } = useGSAP()

const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')
const isFromExplore = urlParams.ref === 'explore'

onMounted(async () => {
	if (isFromExplore) {
		uiStore.setMainUiVisible(true)
		uiStore.setPreloaderVisible(false)
		uiStore.setBottomGradientVisible(true)
		uiStore.setExperienceStartVisible(false)
		uiStore.setExperienceEndVisible(true)

		document.documentElement.dataset.init = true
	}

	if (isDebug) {
		const { default: eruda } = await import('eruda')

		eruda.init({
			container: document.getElementById('eruda-wrapper'),
			tools: ['console'],
		})
	}
})

emitter.on(EVENTS.RESTART, async () => {
	emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)

	audioManager.fadeIn(AUDIO_LABELS.BASE_LOOP)
	audioManager.fadeOut(AUDIO_LABELS.CAMPAIGN_LOOP)

	get(lenis).stop()
	get(lenis).scrollTo(0, { immediate: true, force: true })

	await gsap.delayedCall(0.1, () => {})

	uiStore.reset()
	appStore.reset()
	trackingStore.reset()
})
</script>

<style lang="scss" scoped>
.main-experience {
	@apply grid justify-center items-center;

	height: 100svh;
}

#stats-wrapper,
#debug-wrapper,
#eruda-wrapper {
	@apply fixed z-[9999];
}

#debug-wrapper {
	@apply right-10 top-20 w-80;
}

#stats-wrapper {
	@apply left-1 top-20;
}

#eruda-wrapper {
	@apply bottom-0 w-full;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-from-bottom-enter-active,
.fade-from-bottom-leave-active {
	transition-property: transform, opacity;
	transition-duration: 2s, 1.7s;
	transition-timing-function: ease, ease;
}

.fade-from-bottom-enter-from,
.fade-from-bottom-leave-to {
	transform: translateY(50%);
	opacity: 0;
}
</style>
