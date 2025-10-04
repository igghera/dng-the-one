<template>
	<div class="flex flex-col gap-y-20">
		<section class="main-experience">
			<div class="flex flex-col items-center justify-center gap-y-5">
				<span class="golden-text text-3xl font-medium uppercase"
					>Main experience</span
				>
				<ButtonGolden size="auto" to="/">{{ $t('select') }}</ButtonGolden>

				<ButtonGolden size="square">
					<IconArrowRight class="w-[14px]" />
				</ButtonGolden>

				<ButtonGolden size="wide">{{ $t('start') }}</ButtonGolden>
			</div>
		</section>

		<ExperienceResults />

		<ExperienceTimelineIntro />
	</div>
</template>

<style lang="scss" scoped>
.main-experience {
	@apply grid justify-center items-center;

	height: 100svh;
}
</style>
