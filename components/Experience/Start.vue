<template>
	<Container class="experience-start">
		<header
			class="flex flex-col gap-y-2 items-center justify-center text-center self-start"
		>
			<h1 class="display-1 | text-gold uppercase">
				{{ $t('experience_start.title') }}
			</h1>

			<p
				class="copy | body-4 | golden-text"
				v-html="$t('experience_start.copy')"
			/>
		</header>

		<ButtonGolden class="self-end" size="wide" @click="handleClick">
			{{ $t('start') }}
		</ButtonGolden>
	</Container>
</template>

<script setup>
//
// Refs / State
//
const uiStore = useUiStore()

//
// Methods
//
const handleClick = () => {
	uiStore.setExperienceStartVisible(false)
	uiStore.setExperienceEnterNameVisible(true)
}
</script>

<style lang="scss" scoped>
:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;
}
</style>
