<template>
	<div v-if="result" class="page">
		<div class="card" ref="cardRef">
			<picture class="size-full col-start-1 row-start-1">
				<img
					v-if="imageSrc"
					:src="imageSrc"
					alt="Download Card"
					loading="lazy"
					decoding="async"
					draggable="false"
				/>
			</picture>

			<div class="card-content | text-shadow">
				<span class="body-9 | uppercase text-gold-light">
					{{ $t('download_page.pre_title') }}
				</span>

				<span v-html="result.get('auraFull').title" class="display-3 | golden-text | uppercase" />

				<span v-html="result.get('auraFull')[result.get('shape')].desc" class="card-content-copy | text-gold-light" />
			</div>

			<div class="card-sub-content">
				<picture class="card-sub-content-image">
					<img
						:src="result.get('imageSrc')"
						alt="The One for Men"
						loading="lazy"
						decoding="async"
						draggable="false"
					/>
				</picture>

				<span v-html="$t('download_card.subcontent_title')" class="card-sub-content-title | text-gold-light" />

				<span class="card-sub-content-copy">
					<span
						class="golden-text | uppercase text-[9.4px] leading-[1.3] tracking-[0.05em]"
					>
						{{ result.get('auraFull')[result.get('shape')].fragrance.title }}
					</span>
					<span
						class="text-gold-light text-[10.5px] leading-none tracking-[0.05em]"
						>{{
							result.get('auraFull')[result.get('shape')].fragrance.sub_title
						}}</span
					>
				</span>
			</div>
		</div>

		<nav class="buttons">
			<ButtonRestart to="/" />

			<ButtonGolden
				:disabled="isDownloading"
				@click="handleDownloadButtonClick"
				>{{ $t('results.cta_download') }}</ButtonGolden
			>
		</nav>

		<header class="header">
			<h1 class="title | gap-y-5">
				<span class="pre-title | body-7">{{
					$t('results.pre_title')
				}}</span>

				<span class="title-text">
					<span class="body-2 | golden-text | uppercase">{{
						result.get('auraFull')[result.get('shape')].fragrance.title
					}}</span>
					<span class="text-gold | body-11">{{
						result.get('auraFull')[result.get('shape')].fragrance.sub_title
					}}</span>
				</span>
			</h1>
		</header>

		<picture class="pic">
			<img
				:src="result.get('imageSrc')"
				alt="The One for Men"
				loading="lazy"
				decoding="async"
				draggable="false"
			/>
		</picture>

		<p v-html="result.get('auraFull')[result.get('shape')].fragrance.desc" class="copy | body-4" />

		<ExperienceTimelineIntro class="explore | !p-0" cta-link="/explore" />
	</div>
</template>

<script setup>
import { get, set, useStorage } from '@vueuse/core'

//
// Refs / State
//
const lenis = useLenis()

const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm, locale } = useI18n()

const urlParams = useUrlSearchParams('history')
const storage = useStorage('experience-answers', {})

const result = shallowRef(null)
const isDownloading = shallowRef(false)

const { q1, q2, q3 } = urlParams

//
// Computed
//
const imageSrc = computed(() => {
	if (!get(result)) return null

	return `/images/download-cards/download/0${Number(q1) + 1}_${get(result).get(
		'shape'
	)}.webp`
})

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	get(lenis).start()

	uiStore.setMainUiVisible(true)
	uiStore.setBottomGradientVisible(true)
	document.documentElement.dataset.init = true

	storage.value.q1 = Number(q1)
	storage.value.q2 = Number(q2)
	storage.value.q3 = Number(q3)

	appStore.setStep01Selection(get(storage).q1)
	appStore.setStep02Selection(get(storage).q2)
	appStore.setStep03Selection(get(storage).q3)

	setResult()
})

//
// Watchers
//
watch(locale, () => {
	setResult()
})

//
// Methods
//
const setResult = () => {
	const allAuras = Object.values(tm('auras')).map(option => ({
		id: rt(option.id),
		title: rt(option.title),
		copy_male: rt(option.male.desc),
		copy_female: rt(option.female.desc)
	}))

	const allAurasFull = Object.values(tm('auras')).map(aura => ({
		id: rt(aura.id),
		title: rt(aura.title),
		male: {
			desc: rt(aura.male.desc),
			fragrance: {
				title: rt(aura.male.fragrance.title),
				sub_title: rt(aura.male.fragrance.sub_title),
				desc: rt(aura.male.fragrance.desc),
			},
		},
		female: {
			desc: rt(aura.female.desc),
			fragrance: {
				title: rt(aura.female.fragrance.title),
				sub_title: rt(aura.female.fragrance.sub_title),
				desc: rt(aura.female.fragrance.desc),
			},
		},
	}))

	const allProducts = Object.values(tm('products')).map(product => ({
		title: rt(product.title),
		sub_title: rt(product.sub_title),
		copy: rt(product.copy),
	}))

	const { result: data } = calculateResult(
		Number(q1),
		Number(q2),
		Number(q3),
		allAuras,
		allProducts,
		allAurasFull
	)

	set(result, data)
}

const handleDownloadButtonClick = async () => {
	set(isDownloading, true)

	get(result).set('pre-title', $t('download_page.pre_title'))
	get(result).set('sub-content-title', $t('download_card.subcontent_title'))

	await downloadCard('download', Number(q1), get(result))

	set(isDownloading, false)
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
		'.' // MArgin
		'f' // Timeline Intro
		'.'; // Margin
	grid-template-columns: 1fr;
	grid-template-rows: toRem(60) repeat(5, auto) toRem(40) auto toRem(40);

	@screen md {
		grid-template-rows: toRem(90) repeat(5, auto) toRem(60) auto toRem(60);
	}
}

.card {
	@apply grid aspect-[1131/2010] rounded-[20px] overflow-hidden;

	grid-area: a;
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
	height: min(70svh, toRem(700));

	img {
		@apply size-full object-cover object-center;
	}
}

.card-content {
	@apply flex flex-col items-center text-center col-start-1 row-start-1 self-center justify-self-center;

	row-gap: toRem(12);
	translate: 0 toRem(10);
	width: max(50%, toRem(160));
}

.card-content-copy {
	@apply leading-[1.3] font-normal tracking-[0.04em];

	font-size: toRem(11);
}

.card-sub-content {
	@apply grid gap-x-5 gap-y-[5.3px] col-start-1 row-start-1 self-end justify-self-center -translate-y-7 rounded-lg px-4 py-3;
	@apply bg-white/15 border border-gold-light/15;
	@apply md:-translate-y-16;

	grid-template-areas:
		'a b'
		'a c';
	grid-template-columns: theme('spacing.7') auto;
	grid-template-rows: repeat(2, auto);

	width: max(58%, toRem(200));
}

.card-sub-content-image {
	grid-area: a;
}

.card-sub-content-title {
	@apply uppercase text-left tracking-[0.05em] leading-none self-end;

	font-size: toRem(8.5);
	grid-area: b;
}

.card-sub-content-copy {
	@apply text-left leading-none tracking-[0.05em] self-start;
	@apply flex flex-col items-start gap-y-[5.3px];

	font-size: toRem(8);
	grid-area: c;
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

.explore {
	grid-area: f;
}
</style>
