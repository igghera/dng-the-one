<template>
	<button class="button-back">
		<IconChevronLeft class="w-[10px]" />
	</button>
</template>

<style lang="scss" scoped>
.button-back {
	@apply relative;

	&::before {
		@apply content-[''] absolute top-1/2 left-1/2 size-[50px] -translate-x-1/2 -translate-y-1/2;
		@apply md:size-[60px];
	}
}
</style>
