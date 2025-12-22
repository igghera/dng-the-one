<template>
	<Container class="site-header" tag="header">
		<nav class="buttons-left" ref="buttonsLeftRef">
			<ul class="grid items-start gap-x-10">
				<li style="opacity: 0; visibility: hidden">
					<ButtonBack class="button" />
				</li>

				<li>
					<ButtonAudio class="button" />
				</li>
			</ul>
		</nav>

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
const uiStore = useUiStore()

const { gsap, Observer, Flip } = useGSAP()

const route = useRoute()

const logoButtonRef = useTemplateRef('logoButtonRef')
const buttonsLeftRef = useTemplateRef('buttonsLeftRef')

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

watch(
	() => uiStore.isBackButtonVisible,
	visible => {
		toggleBackButton(visible)
	}
)

//
// Methods
//
const toggleBackButton = visible => {
	const elements = get(buttonsLeftRef).querySelectorAll('li')

	const state = Flip.getState(elements, {
		props: 'opacity',
	})

	gsap.set(elements[0], { opacity: visible ? 1 : 0 })
	elements[1].style.gridArea = visible ? '1 / 2 / 1 / 2' : '1 / 1 / 1 / 1'

	Flip.from(state, {
		duration: 0.5,
		overwrite: true,
		onStart: () => {
			visible && (elements[0].style.visibility = 'inherit')
		},
		onComplete: () => {
			!visible && (elements[0].style.visibility = 'hidden')
		},
	})
}
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

.buttons-left {
	@apply justify-self-start;

	grid-area: a;

	li {
		grid-area: 1 / 1 / 1 / 1;
	}
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
