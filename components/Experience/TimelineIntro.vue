<template>
	<Container class="pb-40 lg:pb-20">
		<picture class="pic">
			<img
				src="/images/mock-timeline-intro.webp"
				alt="Timeline"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<p class="copy | text-gold">
			{{ $t('timeline_intro.copy') }}
		</p>

		<ButtonGolden>{{ $t('timeline_intro.cta') }}</ButtonGolden>
	</Container>
</template>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	@apply gap-y-10 justify-items-center;
	@apply lg:gap-y-20;

	--cols: 1;

	grid-template-areas:
		'a'
		'b'
		'c';
}

.pic {
	@apply w-full max-w-[850px] aspect-[1709_959];

	img {
		@apply w-full h-full object-cover;
	}
}

.copy {
	@apply w-80 text-center;

	@screen lg {
		width: toRem(600);
	}
}
</style>
