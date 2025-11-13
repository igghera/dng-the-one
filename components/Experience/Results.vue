<template>
	<Container>
		<header class="header">
			<span class="pre-title | golden-text | body-1">
				{{ $t('results.pre_title') }}
			</span>

			<h2 class="title">
				<span class="golden-text | body-2 | uppercase">
					{{ appStore.getResult.get('product').title }}
				</span>

				<span class="golden-text | body-1">
					{{ appStore.getResult.get('product').sub_title }}
				</span>
			</h2>
		</header>

		<picture class="pic">
			<img
				:src="appStore.getResult.get('imageSrc')"
				:alt="appStore.getResult.get('product').title"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<p class="copy | body-3-alt">
			{{ appStore.getResult.get('product').copy }}
		</p>
	</Container>
</template>

<script setup>
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
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
	@apply w-full aspect-[194_286];
	// @apply lg:w-56;

	grid-area: b;

	img {
		@apply w-full h-full object-cover;
	}
}

.copy {
	@apply text-gold max-w-64 text-center;
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
