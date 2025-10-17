<template>
	<section class="experience">
		<ExperienceWebGL class="relative z-0" />

		<ExperienceStart
			v-show="uiStore.isExperienceStartVisible"
			class="relative z-[1]"
		/>

		<ExperienceEnterName
			v-show="uiStore.isExperienceEnterNameVisible"
			class="relative z-[1]"
		/>

		<ExperienceStep01
			v-if="uiStore.isExperienceStep01Visible"
			class="relative z-[1]"
		/>

		<ExperienceStep02
			v-if="uiStore.isExperienceStep02Visible"
			class="relative z-[1]"
		/>

		<ExperienceStep03
			v-if="uiStore.isExperienceStep03Visible"
			class="relative z-[1]"
		/>
	</section>
</template>

<script setup>
const uiStore = useUiStore()
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.experience {
	@apply grid h-[100svh];

	grid-template-areas:
		'.'
		'a'
		'.';
	grid-template-columns: 1fr;
	grid-template-rows: toRem(100) 1fr toRem(80);

	@screen lg {
		grid-template-rows: toRem(150) 1fr toRem(80);
	}
}

:deep(> .webgl) {
	grid-column: 1 / -1;
	grid-row: 1 / 4;
}

:deep(> :not(.webgl)) {
	grid-area: a;
}
</style>
