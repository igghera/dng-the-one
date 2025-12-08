<template>
	<div class="scroll-down" aria-hidden="true">
		<svg
			class="w-5 md:w-7 animate-bounce"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 19 11"
		>
			<path
				class="fill-current"
				d="M17.005 10.278a1 1 0 0 0 1.424 0l.209-.212a1 1 0 0 0 0-1.404L10.54.453A1.52 1.52 0 0 0 9.465 0 1.5 1.5 0 0 0 8.39.453L.288 8.662a1 1 0 0 0 0 1.404l.208.211a1 1 0 0 0 1.423 0l6.832-6.92a1 1 0 0 1 1.423 0z"
			/>
		</svg>
	</div>
</template>

<style lang="scss" scoped>
.scroll-down {
	@apply flex items-center justify-center fixed bottom-0 inset-x-0 h-20 z-30 text-center text-gold pointer-events-none;

	background: linear-gradient(to bottom, transparent, ease-in, #00000065);
}
</style>
