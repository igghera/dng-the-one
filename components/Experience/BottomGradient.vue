<template>
	<div class="bottom-gradient" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.bottom-gradient {
	@apply flex items-center justify-center fixed bottom-0 inset-x-0 h-16 z-0 text-center pointer-events-none;
	@apply md:h-36;

	background: linear-gradient(to top, #31190e, ease-in-out, #31190e00);
}
</style>
