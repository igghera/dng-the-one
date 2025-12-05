<template>
	<Container class="site-header" tag="header">
		<ButtonAudio class="button button-left" />

		<LogoLettering class="logotype" />

		<ClientOnly>
			<template v-if="isExplorePage">
				<a
					v-if="isFirstView && !isFromEngagement"
					href="/"
					class="button button-right"
				>
					<ButtonClose tag="div" />
				</a>

				<a
					v-else-if="!isFirstView && isFromEngagement"
					class="button button-right"
					:href="engagementPageLink"
				>
					<ButtonClose tag="div" />
				</a>
			</template>

			<ButtonLanguage v-else class="button button-right" />
		</ClientOnly>
	</Container>
</template>

<script setup>
import { useStorage, set } from '@vueuse/core'

//
// Refs / State
//
const route = useRoute()

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

watchEffect(() => {
	if (import.meta.server) return

	set(isFromEngagement, route.query.ref === 'engagement')
	set(engagementPageLink, window.history.state.back)
})
</script>

<style lang="scss" scoped>
.site-header {
	@apply fixed z-40 top-[30px] w-full pointer-events-none;
	@apply lg:landscape:top-3;

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
	@apply w-[150px] justify-self-center;
	@apply md:w-64;

	grid-area: b;
}

.button-right {
	@apply justify-self-end;

	grid-area: c;
}
</style>
