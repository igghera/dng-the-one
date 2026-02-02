<template>
	<Container
		class="site-footer"
		tag="footer"
		:data-is-app="config.public.isAppMode"
	>
		<button
			v-if="config.public.isAppMode"
			class="button button-left | ui-2 | uppercase"
			@click="uiStore.setPrivacyModalVisible(true)"
		>
			Privacy
		</button>

		<NuxtLink
			v-else
			class="button button-left | ui-2 | uppercase"
			:to="$t('link_privacy_policy')"
			target="_blank"
			>Privacy</NuxtLink
		>

		<NuxtLink
			v-if="!config.public.isAppMode"
			class="button button-right | ui-2 | uppercase"
			:to="$t('link_cookies_policy')"
			target="_blank"
			>Cookies</NuxtLink
		>
	</Container>
</template>

<script setup>
const config = useRuntimeConfig()

const uiStore = useUiStore()
</script>

<style lang="scss" scoped>
.site-footer {
	@apply fixed z-[40] bottom-3 w-full text-gold py-[5px] pointer-events-none;
	@apply md:bottom-14;
	@apply lg:bottom-11;

	&[data-is-app='true'] {
		@apply md:bottom-9;
		@apply lg:bottom-6;
	}

	:deep(.site-grid) {
		--cols: 2;

		@apply items-center;

		grid-template-areas: 'a b';
	}
}

.button {
	@apply pointer-events-auto;
}

.button-left {
	@apply justify-self-start;

	grid-area: a;
}

.button-right {
	@apply justify-self-end;

	grid-area: b;
}
</style>
