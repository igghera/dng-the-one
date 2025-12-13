<template>
	<Container class="pb-40 lg:pb-20">
		<picture class="pic">
			<img
				src="/images/timeline-intro.webp"
				alt="Timeline"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<p class="copy | text-gold">
			{{ $t('timeline_intro.copy') }}
		</p>

		<ButtonGolden :to="ctaLink" @click="handleCtaClick" class="!text-gold">{{
			$t('timeline_intro.cta')
		}}</ButtonGolden>
	</Container>
</template>

<script setup>
defineProps({
	ctaLink: {
		type: String,
		required: true,
	},
})

const handleCtaClick = () => {
	appStore.setAudioEnabled(false)
	audioManager.fadeOut(AUDIO_LABELS.CAMPAIGN_LOOP)
}
</script>

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
	@apply max-w-64 text-center font-medium text-base leading-tight tracking-[0.05em];
	@apply lg:max-w-80;
}
</style>
