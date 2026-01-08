<template>
	<Container>
		<header class="header">
			<span class="pre-title | golden-text | body-1">
				{{ $t('results.pre_title') }}
			</span>

			<h2 class="title">
				<span class="golden-text | body-2 | uppercase">
					{{
						appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
							.fragrance.title
					}}
				</span>

				<span class="golden-text | body-1">
					{{
						appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
							.fragrance.sub_title
					}}
				</span>
			</h2>
		</header>

		<picture class="pic">
			<img
				:src="appStore.getResult.get('imageSrc')"
				:alt="
					appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
						.fragrance.title
				"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<ButtonGolden
			v-if="isFromNotino"
			:to="getShopCtaLink(productId, urlParams.ref, shopCtaCountry)"
			target="_blank"
		>
			{{ $t('shop_now') }}
		</ButtonGolden>

		<p class="copy">
			{{
				appStore.getResult.get('auraFull')[appStore.getResult.get('shape')]
					.fragrance.desc
			}}
		</p>
	</Container>
</template>

<script setup>
//
// Refs / State
//
const appStore = useAppStore()

const urlParams = useUrlSearchParams('history')

const isFromNotino = urlParams.ref === 'notino'

//
// Computed
//
const shopCtaCountry = computed(() => {
	return urlParams.country ?? 'italy'
})

const productId = computed(() => {
	return appStore.getResult.get('product').id
})
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
	@apply aspect-[194_286];

	grid-area: b;
	width: min(50%, toRem(400));

	img {
		@apply size-full object-cover;
	}
}

.copy {
	@apply text-gold max-w-64 text-center font-medium text-base leading-tight tracking-[0.05em];
	@apply lg:max-w-80;

	grid-area: c;
}

.header {
	@apply flex flex-col gap-y-5 items-center justify-center text-center;

	grid-area: a;
}

.pre-title {
	@apply uppercase font-medium;
}

.title {
	@apply flex flex-col items-center justify-center font-normal;
}
</style>
