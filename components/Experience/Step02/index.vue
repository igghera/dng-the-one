<template>
	<Container class="pointer-events-none">
		<header class="header">
			<h2
				class="display-2 | golden-text uppercase"
				v-html="$t('experience_step_02.title')"
			/>

			<div class="labels">
				<span
					class="label | body-7"
					v-for="(label, idx) in labels"
					:key="label"
					:data-index="idx"
					:data-visible="currentStep === idx"
				>
					{{ label }}
				</span>
			</div>
		</header>

		<div class="content | pointer-events-auto bg-[#ff000000]">
			<div class="track-wrapper">
				<ExperienceStep02Track class="track" />
			</div>

			<div class="dragger-wrapper" style="transform: translateY(-50%)">
				<ExperienceStep02Dragger class="dragger" />
			</div>
		</div>

		<ButtonGolden class="cta" size="wide" @click="handleClick">
			{{ $t('select') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { rt, tm } = useI18n()

const currentStep = shallowRef(0)

//
// Computed
//
const labels = computed(() => {
	return Object.values(tm('experience_step_02.labels')).map(label => rt(label))
})

//
// Methods
//
const handleClick = () => {
	console.log('handleClick')
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center text-center;

	grid-template-areas:
		'a'
		'b'
		'c';

	grid-template-rows: auto 1fr auto;
}

.header {
	@apply flex flex-col gap-y-5 items-center justify-center;
	@apply lg:gap-y-6;

	grid-area: a;
}

.labels {
	@apply grid;

	& > * {
		@apply col-start-1 row-start-1;
	}
}

.label {
	@apply text-gold-light;
	@apply transition-opacity duration-500 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}
}

.content {
	--mask-top-from-position: 70%;
	--mask-top-to-position: 90%;
	--mask-top-from-color: black;
	--mask-top-to-color: transparent;
	--mask-top: linear-gradient(
		to top,
		var(--mask-top-from-color) var(--mask-top-from-position),
		var(--mask-top-to-color) var(--mask-top-to-position)
	);

	--mask-bottom-from-position: 70%;
	--mask-bottom-to-position: 90%;
	--mask-bottom-from-color: black;
	--mask-bottom-to-color: transparent;
	--mask-bottom: linear-gradient(
		to bottom,
		var(--mask-bottom-from-color) var(--mask-bottom-from-position),
		var(--mask-bottom-to-color) var(--mask-bottom-to-position)
	);

	// mask-image: var(--mask-bottom), var(--mask-top);
	mask-composite: intersect;
	mask-repeat: no-repeat;

	@apply grid items-center;

	grid-area: b;
}

.track-wrapper {
	@apply flex items-end justify-self-center;

	height: clamp(350px, 440px, 50svh);

	> * {
		@apply col-start-1 row-start-1;
	}
}

.dragger-wrapper {
	@apply aspect-square self-end justify-self-center;

	width: toRem(72);

	@screen lg {
		width: toRem(96);
	}
}

.instructions,
.cta {
	@apply self-center;

	grid-area: c;
}
</style>
