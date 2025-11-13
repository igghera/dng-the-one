<template>
	<div class="page">
		<picture class="card">
			<img
				v-if="imageSrc"
				:src="imageSrc"
				alt="Download Card"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<nav class="buttons">
			<ButtonRestart to="/" />

			<ButtonGolden @click="handleDownloadButtonClick">{{
				$t('results.cta_download')
			}}</ButtonGolden>
		</nav>

		<header class="header">
			<h1 class="title | gap-y-5">
				<span class="pre-title | body-7">{{ $t('download.pre_title') }}</span>

				<span class="title-text">
					<span class="body-2 | golden-text | uppercase">{{
						$t('products.0.title')
					}}</span>
					<span class="text-gold | body-11">{{
						$t('products.0.sub_title')
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
			{{ $t('products.0.copy') }}
		</p>
	</div>
</template>

<script setup>
import { get } from '@vueuse/core'

const lenis = useLenis()
const uiStore = useUiStore()

const imageSrc = computed(() => {
	return `/images/mock-download-card.webp`
})

onMounted(async () => {
	await nextTick()

	get(lenis).start()

	uiStore.setMainUiVisible(true)
	document.documentElement.dataset.init = true
})

const handleDownloadButtonClick = () => {
	downloadImage(imageSrc.value, 'the-one-card.png')
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.page {
	@apply grid gap-y-10 justify-items-center items-center text-center;

	grid-template-areas: '.' // Margin
		'a' // Card
		'b' // Buttons
		'c' // Header
		'd' // Picture
		'e' // Copy
		'.'; // Margin
	grid-template-columns: 1fr;
	grid-template-rows: toRem(60) repeat(5, auto) toRem(40);

	@screen md {
		grid-template-rows: toRem(90) repeat(5, auto) toRem(60);
	}
}

.card {
	@apply aspect-[538_957];

	grid-area: a;
	width: min(75%, toRem(538));

	img {
		@apply size-full object-contain object-center;
	}
}

.buttons {
	@apply flex items-center justify-center gap-x-5;

	grid-area: b;
}

.header {
	grid-area: c;
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

	grid-area: d;
	width: min(45%, toRem(444));

	img {
		@apply w-full h-full object-contain object-center;
	}
}

.copy {
	@apply text-gold;

	grid-area: e;
	width: min(80%, toRem(400));
}
</style>
