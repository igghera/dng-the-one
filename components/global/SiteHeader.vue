<template>
	<Container class="site-header" tag="header">
		<ButtonAudio class="button button-left" />

		<button class="logotype" ref="logoButtonRef" @contextmenu.prevent>
			<LogoLettering />
		</button>

		<ClientOnly>
			<template v-if="isExplorePage">
				<!-- If first view - Show "Start experience" -->
				<a
					v-if="isFirstView && !isFromEngagement"
					href="/"
					class="button button-right"
				>
					<span class="ui-2 | uppercase inline-block -translate-y-[0.7em]"
						><span class="md-down:hidden"> {{ $t('start_experience') }} </span
						><span class="md:hidden">
							{{ $t('start') }}
						</span></span
					>
				</a>

				<!-- If coming from engagement page - Show Close button -->
				<a
					v-else-if="!isFirstView && isFromEngagement"
					class="button button-right"
					:href="engagementPageLink"
				>
					<ButtonClose tag="div" />
				</a>

				<!-- If coming from main experience - Show Close button -->
				<a v-else class="button button-right" href="/?ref=explore">
					<ButtonClose tag="div" />
				</a>
			</template>

			<template v-else>
				<ButtonLanguage class="button button-right" />

				<LanguageSelector class="language-selector" />
			</template>
		</ClientOnly>
	</Container>
</template>

<script setup>
import { useStorage, get, set } from '@vueuse/core'

//
// Refs / State
//
const { gsap, Observer } = useGSAP()

const route = useRoute()

const logoButtonRef = useTemplateRef('logoButtonRef')

const isFromEngagement = shallowRef(false)
const engagementPageLink = shallowRef('/engagement')

//
// Computed
//
const isExplorePage = computed(() => route.path === '/explore')

const isFirstView = computed(() => {
	const state = useStorage('isFirstView', false)
	return state.value
})

//
// Lifecycle
//
onMounted(() => {
	let click = false
	let longPress = false
	let longPressTween = null

	Observer.create({
		target: get(logoButtonRef),
		type: 'pointer,touch',
		onPress: () => {
			click = true

			longPressTween = gsap.delayedCall(1, () => {
				longPress = true

				// TODO: Add configuration panel
				console.log('TODO: Add configuration panel')
			})
		},
		onRelease: () => {
			if (route.fullPath !== '/') return
			if (!click) return

			if (longPress) {
				// Do nothing
			} else {
				emitter.emit(EVENTS.RESTART)
			}

			longPressTween?.kill()
			longPress = false
			click = false
		},
	})
})

//
// Watchers
//
watchEffect(() => {
	if (import.meta.server) return

	set(isFromEngagement, route.query.ref === 'engagement')
	set(engagementPageLink, window.history.state.back)
})
</script>

<style lang="scss" scoped>
.site-header {
	@apply fixed z-40 top-[30px] w-full pointer-events-none text-gold-light;
	@apply md:top-12;
	@apply lg:top-9;

	:deep(.site-grid) {
		@apply items-start;

		grid-template-areas: 'a a b b c c';
	}
}

.button {
	@apply pointer-events-auto text-gold;
}

.button-left {
	@apply justify-self-start;

	grid-area: a;
}

.logotype {
	@apply w-[150px] justify-self-center pointer-events-auto;
	@apply md:w-64;

	grid-area: b;
	user-select: none;
	-webkit-touch-callout: none;
}

.button-right {
	@apply justify-self-end;

	grid-area: c;
}

.language-selector {
	@apply justify-self-end translate-x-[18px];

	grid-area: c;
}
</style>
