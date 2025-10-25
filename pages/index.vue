<template>
	<div class="flex flex-col gap-y-20">
		<Experience />

		<ExperienceResults />

		<ExperienceTimelineIntro />

		<ClientOnly>
			<div id="stats-wrapper" v-if="isDebug"></div>
			<div id="debug-wrapper" v-if="isDebug"></div>
			<div id="eruda-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')

onMounted(async () => {
	if (isDebug) {
		const { default: eruda } = await import('eruda')

		eruda.init({
			container: document.getElementById('eruda-wrapper'),
			tools: ['console'],
		})
	}
})
</script>

<style lang="scss" scoped>
.main-experience {
	@apply grid justify-center items-center;

	height: 100svh;
}

#debug-wrapper {
	@apply fixed z-[1] right-10 top-20 w-80;
}

#stats-wrapper {
	@apply fixed z-[1] left-1 top-20;
}

#eruda-wrapper {
	@apply fixed z-[1] bottom-0 w-full;
}
</style>
