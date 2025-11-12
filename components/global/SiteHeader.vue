<template>
	<Container class="site-header" tag="header">
		<ButtonAudio class="button button-left" />

		<LogoLettering class="logotype" />

		<ButtonLanguage class="button button-right" />
	</Container>
</template>

<style lang="scss" scoped>
.site-header {
	@apply fixed z-40 top-3 w-full pointer-events-none;

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
