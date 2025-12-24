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
					<div class="content-header | text-shadow">
						<p v-for="row in data.title" :key="row" class="content-title">
							{{ row }}
						</p>
					</div>

					<picture class="content-image">
						<img
							:src="data.image"
							alt=""
							class="w-full"
							loading="lazy"
							decoding="async"
							draggable="false"
						/>
					</picture>

					<p class="content-copy">
						{{ data.copy }}
					</p>
				</div>
			</ClientOnly>
		</div>

		<ExperienceTimelineIntro
			class="explore"
			cta-link="/explore?ref=engagement"
		/>

		<Transition name="fade">
			<ExperienceTopGradient v-if="uiStore.isTopGradientVisible" />
		</Transition>
	</div>
</template>

<script setup>
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const lenis = useLenis()
const uiStore = useUiStore()

const { rt, tm, locale } = useI18n()

const { gsap } = useGSAP()

const urlParams = useUrlSearchParams('history')

const isDownloading = shallowRef(false)

const { aura } = urlParams

const images = Object.freeze([
	'00-bold',
	'01-elegant',
	'02-warm',
	'03-warm',
	'04-powerful',
	'05-sophisticated',
	'06-intriguing',
	'07-mysterious',
])

//
// Computed
//
const imageSrc = computed(() => {
	if (!get(aura)) return null

	return `/images/download-cards/engagement/${get(locale)}/${
		images[Number(aura)]
	}.webp`
})

const data = computed(() => {
	switch (get(aura)) {
		case '0':
			return {
				title: Object.values(
					tm('engagement.result[0].title').map(row => rt(row))
				),
				image: rt(tm('engagement.result[0].image')),
				copy: rt(tm('engagement.result[0].copy')),
			}
		case '1':
			return {
				title: Object.values(
					tm('engagement.result[2].title').map(row => rt(row))
				),
				image: rt(tm('engagement.result[2].image')),
				copy: rt(tm('engagement.result[2].copy')),
			}
		case '2':
			return {
				title: Object.values(
					tm('engagement.result[1].title').map(row => rt(row))
				),
				image: rt(tm('engagement.result[1].image')),
				copy: rt(tm('engagement.result[1].copy')),
			}
		case '3':
			return {
				title: Object.values(
					tm('engagement.result[3].title').map(row => rt(row))
				),
				image: rt(tm('engagement.result[3].image')),
				copy: rt(tm('engagement.result[3].copy')),
			}
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

	const path = `/images/download-cards/engagement/${get(locale)}/${
		images[Number(aura)]
	}.png`

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
	@apply text-gold-light uppercase text-xl font-body font-medium leading-normal tracking-[0.05em];
}

.content-inner {
	@apply flex flex-col items-center gap-y-10;
}

.content-header {
	@apply flex flex-col gap-y-2 items-center text-center;
}

.content-copy {
	width: min(100%, toRem(360));
}

.content-title {
	@apply capitalize text-gold-light text-base font-body leading-tight tracking-[0.03em] font-medium;
}

.content-image {
	width: min(100%, toRem(230));

	@screen md {
		width: toRem(500);
	}
}

.product-copy {
	@apply text-sm leading-none tracking-[0.05em] font-medium max-w-64;
}

.explore {
	@apply flex flex-col gap-y-10 items-center;

	grid-area: d;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
