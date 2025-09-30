<template>
	<button class="button" aria-label="Toggle language">{{ locale }}</button>
</template>

<script setup>
const { locale } = useI18n()
</script>

<style lang="scss" scoped>
.button {
	@apply uppercase size-[50px] grid items-center justify-center;
	@apply md:size-[60px];
}
</style>
