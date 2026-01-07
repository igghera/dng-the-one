<template>
	<div class="scroll-down" aria-hidden="true">
		<span class="ui-2 | uppercase">{{ $t('scroll_down') }}</span>

		<svg
			class="w-5 md:w-7 -scale-100"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 19 11"
			overflow="visible"
		>
			<g class="animate-bounce">
				<path
					class="fill-current"
					d="M17.005 10.278a1 1 0 0 0 1.424 0l.209-.212a1 1 0 0 0 0-1.404L10.54.453A1.52 1.52 0 0 0 9.465 0 1.5 1.5 0 0 0 8.39.453L.288 8.662a1 1 0 0 0 0 1.404l.208.211a1 1 0 0 0 1.423 0l6.832-6.92a1 1 0 0 1 1.423 0z"
				/>
			</g>
		</svg>
	</div>
</template>

<style lang="scss" scoped>
.scroll-down {
	@apply flex flex-col items-center justify-center gap-y-2 fixed bottom-0 inset-x-0 h-24 z-30 text-center text-gold pointer-events-none;

	background: linear-gradient(to bottom, transparent, ease-in, #00000065);
}
</style>
