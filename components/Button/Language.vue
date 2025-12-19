<template>
	<button
		class="button"
		aria-label="Toggle language"
		data-button-language
		@click="handleClick"
	>
		<span class="relative z-[1] leading-none -translate-y-[0.15em]">{{
			locale
		}}</span>
	</button>
</template>

<script setup>
const { locale } = useI18n()

const handleClick = () => {
	emitter.emit(EVENTS.TOGGLE_LANGUAGE_SELECTOR)
}
</script>

<style lang="scss" scoped>
.button {
	@apply uppercase grid items-center justify-center relative;

	&::before {
		@apply content-[''] absolute top-1/2 left-1/2 size-[50px] -translate-x-1/2 -translate-y-1/2;
		@apply md:size-[60px];
	}
}
</style>
