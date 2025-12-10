<template>
	<div class="page">
		<div class="card" ref="cardRef">
			<ClientOnly>
				<picture class="overflow-hidden size-full col-start-1 row-start-1">
					<img
						v-if="imageSrc"
						:src="imageSrc"
						alt="Download Card"
						loading="lazy"
						decoding="async"
						draggable="false"
					/>
				</picture>
			</ClientOnly>
		</div>

		<nav class="buttons">
			<ButtonGolden
				class="!text-gold"
				:disabled="isDownloading"
				@click="handleDownloadButtonClick"
				>{{ $t('download') }}</ButtonGolden
			>
		</nav>

		<div class="content">
			<p class="content-pre-title">{{ $t('engagement.pre_title') }}</p>

			<ClientOnly>
				<div class="content-inner">
					<div
						v-for="product in selectedProducts"
						:key="product.title"
						class="product"
					>
						<div class="product-header | text-shadow">
							<p class="product-title | golden-text">{{ product.title }}</p>
							<p class="product-sub-title">{{ product.sub_title }}</p>
						</div>

						<picture class="product-image">
							<img
								:src="product.image"
								:alt="product.title"
								class="w-full"
								loading="lazy"
								decoding="async"
								draggable="false"
							/>
						</picture>

						<p class="product-copy | text-shadow">{{ product.copy }}</p>
					</div>
				</div>
			</ClientOnly>
		</div>

		<ExperienceTimelineIntro
			class="explore"
			cta-link="/explore?ref=engagement"
		/>
	</div>
</template>

<script setup>
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const lenis = useLenis()
const uiStore = useUiStore()

const { rt, tm } = useI18n()

const { gsap } = useGSAP()

const urlParams = useUrlSearchParams('history')

const isDownloading = shallowRef(false)

const { aura } = urlParams

const images = Object.freeze([
	'bold',
	'elegant',
	'discrete',
	'warm',
	'resonant',
	'glowing',
	'gentle',
	'refined',
])

const allProducts = Object.values(tm('products')).map(product => ({
	title: rt(product.title),
	sub_title: rt(product.sub_title),
	copy: rt(product.copy),
	image: rt(product.image),
}))

//
// Computed
//
const imageSrc = computed(() => {
	if (!get(aura)) return null

	return `/images/engagement/${images[Number(aura)]}.webp`
})

const selectedProducts = computed(() => {
	switch (get(aura)) {
		case '0':
		case '4':
			return [allProducts[2], allProducts[5]]
		case '1':
		case '5':
			return [allProducts[0], allProducts[3]]
		case '2':
		case '6':
			return [allProducts[0], allProducts[4]]
		case '3':
		case '7':
			return [allProducts[1], allProducts[3]]
	}
})

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	get(lenis).scrollTo(0, { immediate: true, force: true })
	get(lenis).start()

	uiStore.setMainUiVisible(true)
	document.documentElement.dataset.init = true
})

//
// Methods
//
const handleDownloadButtonClick = async () => {
	set(isDownloading, true)

	const path = `/images/engagement/${images[Number(aura)]}.png`

	const link = document.createElement('a')
	link.href = path
	link.download = `engagement-${images[Number(aura)]}.png`
	link.click()

	gsap.delayedCall(1, () => {
		set(isDownloading, false)
	})
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.page {
	@apply grid gap-y-10 justify-items-center items-center text-center px-5 mx-auto max-w-4xl text-gold;
	@apply md:gap-y-16;

	grid-template-areas: '.' // Margin
		'a' // Card
		'b' // Buttons
		'c' // Content
		'd'; // Explore
	grid-template-columns: 1fr;
	grid-template-rows: toRem(60) repeat(4, auto);

	@screen md {
		grid-template-rows: toRem(90) repeat(4, auto);
	}
}

.card {
	@apply grid aspect-[750/1334] rounded-[20px] overflow-hidden;

	background-clip: padding-box, border-box;
	background-origin: border-box;
	background-image: linear-gradient(#8c3610, #3c1707),
		linear-gradient(
			147.91deg,
			#f5d982 0.03%,
			rgba(245, 217, 130, 0) 47.62%,
			rgba(245, 217, 130, 0) 67.33%,
			#f5d982 100.03%
		);
	border: 2px solid transparent;
	border-image: var(--border-color) 1;
	grid-area: a;
	height: min(70svh, toRem(700));

	img {
		@apply size-full object-cover object-center;
	}
}

.buttons {
	@apply flex items-center justify-center gap-x-5;

	grid-area: b;
}

.content {
	@apply flex flex-col gap-y-5;

	grid-area: c;
}

.content-pre-title {
	@apply text-gold uppercase text-base font-medium leading-none tracking-[0.05em];
}

.content-inner {
	@apply flex flex-col gap-y-12;
}

.product {
	@apply flex flex-col gap-y-10 items-center;
}

.product-header {
	@apply flex flex-col gap-y-1 items-center;
}

.product-title {
	@apply uppercase leading-none tracking-[0.05em] font-medium;

	font-size: toRem(22);
}

.product-sub-title {
	@apply text-base leading-none tracking-[0.05em] font-medium;
}

.product-image {
	width: toRem(200);
}

.product-copy {
	@apply text-sm leading-none tracking-[0.05em] font-medium max-w-64;
}

.explore {
	@apply flex flex-col gap-y-10 items-center;

	grid-area: d;
}
</style>
