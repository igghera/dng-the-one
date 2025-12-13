<template>
	<section class="experience">
		<ExperienceWebGL
			class="relative z-0"
			:data-visible="uiStore.isWebglVisible"
		/>

		<ExperienceStart
			v-show="uiStore.isExperienceStartVisible"
			class="relative z-[1]"
		/>

		<ExperienceEnterName
			v-show="uiStore.isExperienceEnterNameVisible"
			class="experience-step | relative z-[1]"
		/>

		<ExperienceStep01
			v-if="uiStore.isExperienceStep01Visible"
			class="experience-step | relative z-[1]"
		/>

		<ExperienceStep02
			v-if="uiStore.isExperienceStep02Visible"
			class="experience-step | relative z-[1]"
		/>

		<ExperienceStep03
			v-if="uiStore.isExperienceStep03Visible"
			class="experience-step | relative z-[1]"
		/>

		<ExperienceEnd
			v-if="uiStore.isExperienceEndVisible"
			id="experience-end"
			class="relative z-[1]"
		/>
	</section>
</template>

<script setup>
const uiStore = useUiStore()

onMounted(() => {
	audioManager.preload()
})
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.experience {
	@apply grid h-[100svh] overflow-hidden;

	grid-template-areas:
		'.'
		'a'
		'.';
	grid-template-columns: 1fr;
	grid-template-rows: toRem(94) 1fr toRem(80);

	@screen md {
		grid-template-rows: toRem(110) 1fr toRem(80);
	}
}

.experience-step {
	@screen tablet-portrait {
		@apply pt-[6vh] pb-[5vh];
	}
}

:deep(> .webgl) {
	@apply transition-opacity duration-1000 ease-out;

	&[data-visible='false'] {
		@apply opacity-0;
	}

	grid-column: 1 / -1;
	grid-row: 1 / 4;
}

:deep(> :not(.webgl)) {
	grid-area: a;
}
</style>
