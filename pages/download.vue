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
					{{ $t('results.pre_title') }}
				</span>

				<span class="display-3 | golden-text | uppercase">
					{{ result.get('auraFull').title }}
				</span>

				<span class="body-10 | text-gold-light">
					{{ result.get('auraFull')[result.get('shape')].desc }}
				</span>
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

				<span class="card-sub-content-title | text-gold-light">
					{{ $t('download.card_subcontent_title') }}
				</span>

				<span class="card-sub-content-copy | text-gold-light">
					{{ result.get('auraFull')[result.get('shape')].fragrance.title }}
					{{ result.get('auraFull')[result.get('shape')].fragrance.sub_title }}
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
				<span class="pre-title | body-7">{{ $t('download.pre_title') }}</span>

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

		<p class="copy | body-4">
			{{ result.get('auraFull')[result.get('shape')].fragrance.desc }}
		</p>
	</div>
</template>

<script setup>
import { get, set } from '@vueuse/core'
import { snapdom } from '@zumer/snapdom'

//
// Refs / State
//
const lenis = useLenis()
const uiStore = useUiStore()

const { rt, tm } = useI18n()

const { gsap } = useGSAP()

const urlParams = useUrlSearchParams('history')

const cardRef = useTemplateRef('cardRef')

const result = shallowRef(null)
const isDownloading = shallowRef(false)

const { q1, q2, q3, card } = urlParams

const allAuras = Object.values(tm('experience_end.options')).map(option => ({
	title: rt(option.title),
	copy: rt(option.copy),
}))

const allAurasFull = Object.values(tm('auras')).map(aura => ({
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

//
// Computed
//
const imageSrc = computed(() => {
	if (!get(result)) return null

	return `/images/download-cards/0${card}_${get(result).get('shape')}.webp`
})

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	get(lenis).start()

	uiStore.setMainUiVisible(true)
	document.documentElement.dataset.init = true

	const res = calculateResult(
		Number(q1),
		Number(q2),
		Number(q3),
		allAuras,
		allProducts,
		allAurasFull
	)

	set(result, res.result)
})

//
// Methods
//
const handleDownloadButtonClick = async event => {
	set(isDownloading, true)

	const { currentTarget: button } = event

	gsap.to(button, {
		opacity: 0.5,
		duration: 0.5,
		overwrite: true,
	})

	await snapdom.download(get(cardRef), {
		format: 'png',
		filename: `the-one-card-${Date.now()}.png`,
		scale: 2,
	})

	gsap.delayedCall(0.8, () => {
		gsap.to(button, {
			opacity: 1,
			duration: 0.8,
			overwrite: true,
			onStart: () => {
				set(isDownloading, false)
			},
		})
	})
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
	@apply grid aspect-[393/852];

	grid-area: a;
	height: min(70svh, toRem(700));

	img {
		@apply size-full object-contain object-center;
	}
}

.card-content {
	@apply flex flex-col items-center text-center col-start-1 row-start-1 self-center justify-self-center;

	row-gap: toRem(10);
	width: 70%;
}

.card-sub-content {
	@apply grid gap-x-2 gap-y-1 col-start-1 row-start-1 self-end justify-self-center -translate-y-16 rounded-lg px-4 py-3;
	@apply bg-white/15 border border-gold-light/15;

	grid-template-areas:
		'a b'
		'a c';
	grid-template-columns: theme('spacing.7') auto;
	grid-template-rows: repeat(2, auto);
	width: 70%;
}

.card-sub-content-image {
	grid-area: a;
}

.card-sub-content-title {
	@apply uppercase text-left tracking-[0.05em] leading-none self-end;

	font-size: toRem(7);
	grid-area: b;
}

.card-sub-content-copy {
	@apply text-left leading-none tracking-[0.05em] self-start;

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
</style>
