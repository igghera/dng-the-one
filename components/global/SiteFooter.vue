<template>
	<Container class="site-footer" tag="footer">
		<NuxtLink
			class="button button-left | ui-2 | uppercase"
			to="https://www.google.com?privacy"
			target="_blank"
			>Privacy</NuxtLink
		>

		<NuxtLink
			class="button button-right | ui-2 | uppercase"
			to="https://www.google.com?cookies"
			target="_blank"
			>Cookies</NuxtLink
		>
	</Container>
</template>

<style lang="scss" scoped>
.site-footer {
	@apply fixed z-[40] bottom-3 w-full text-gold py-[5px] pointer-events-none;
	@apply md-down:px-11;

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
