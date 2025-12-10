<template>
	<component
		:is="tag"
		class="button"
		:aria-label="tag === 'button' ? 'Close' : null"
	>
		<IconClose class="size-4" />
	</component>
</template>

<script setup>
const props = defineProps({
	tag: {
		type: String,
		default: 'button',
		validator: value => ['button', 'div'].includes(value),
	},
})
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
