<template>
	<div class="page">
		<header class="header">
			<h1 class="title">
				<span class="pre-title | body-7">{{ $t('download.pre_title') }}</span>

				<span class="title-text">
					<span class="body-2 | golden-text | uppercase">{{
						$t('download.options.0.title')
					}}</span>
					<span class="text-gold | body-11">{{
						$t('download.options.0.sub_title')
					}}</span>
				</span>
			</h1>
		</header>

		<picture class="pic">
			<img
				src="/images/mock-perfume.webp"
				alt="The One for Men"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<p class="copy | body-4">
			{{ $t('download.options.0.copy') }}
		</p>
	</div>
</template>

<script setup>
const uiStore = useUiStore()

onMounted(() => {
	uiStore.setMainUiVisible(true)
	document.documentElement.dataset.init = true
})
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.page {
	@apply grid gap-y-5 justify-items-center items-center min-h-[100svh] text-center;

	grid-template-areas:
		'.'
		'a'
		'b'
		'c'
		'.';
	grid-template-columns: 1fr;
	grid-template-rows: toRem(60) repeat(3, auto) toRem(40);

	@screen md {
		grid-template-rows: toRem(90) repeat(3, auto) toRem(60);
	}
}

.header {
	grid-area: a;
}

.title,
.title-text {
	@apply flex flex-col;
}

.pre-title {
	@apply text-gold uppercase;
}

.pic {
	@apply aspect-[277_409];

	height: 50svh;

	img {
		@apply w-full h-full object-contain object-center;
	}

	grid-area: b;
}

.copy {
	@apply text-gold;

	grid-area: c;
	width: min(80%, toRem(400));
}
</style>
