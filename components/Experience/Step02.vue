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

		<div class="content | debug | pointer-events-auto">content</div>

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
	grid-area: b;
}

.instructions,
.cta {
	@apply self-center;

	grid-area: c;
}
</style>
