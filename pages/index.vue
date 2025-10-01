<template>
	<div>
		<section class="main-experience | debug debug--green debug--inset">
			<div class="flex flex-col items-center justify-center gap-y-5">
				<span class="golden-text text-3xl font-medium uppercase"
					>Main experience</span
				>
				<ButtonGolden size="auto" to="/">Auto</ButtonGolden>
				<ButtonGolden size="square">Square</ButtonGolden>
				<ButtonGolden size="wide">Wide</ButtonGolden>
			</div>
		</section>

		<section class="h-[275svh] debug debug--inset"></section>
	</div>
</template>

<style lang="scss" scoped>
.main-experience {
	@apply grid justify-center items-center;

	height: 100svh;
}
</style>
