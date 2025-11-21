<template>
	<Container class="site-header" tag="header">
		<ButtonAudio class="button button-left" />

		<LogoLettering class="logotype" />

		<a v-if="isExplorePage" href="/" class="button button-right">
			<ButtonClose />
		</a>

		<ButtonLanguage v-else class="button button-right" />
	</Container>
</template>

<script setup>
const route = useRoute()

const isExplorePage = computed(() => route.path === '/explore')
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
