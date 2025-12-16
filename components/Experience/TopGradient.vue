<template>
	<div class="top-gradient" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.top-gradient {
	@apply flex items-center justify-center fixed top-0 inset-x-0 h-32 z-30 text-center pointer-events-none;

	background: linear-gradient(
		to bottom in oklch,
		oklch(17.3% 0.029 31.97 / 100%) 30%,
		oklch(17.3% 0.029 31.97 / 0%)
	);
}
</style>
