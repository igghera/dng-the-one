<template>
	<div>
		<ClientOnly>
			<Explore v-if="isDebug" />
			<ExploreDummy v-else />

			<div id="stats-wrapper" v-if="isDebug"></div>
			<div id="debug-wrapper" v-if="isDebug"></div>
			<div id="eruda-wrapper" v-if="isDebug"></div>
		</ClientOnly>
	</div>
</template>

<script setup>
const uiStore = useUiStore()

const urlParams = useUrlSearchParams('history')
const isDebug = Object.hasOwn(urlParams, 'debug')

onMounted(() => {
	uiStore.setMainUiVisible(true)
})
</script>

<style lang="scss" scoped>
#stats-wrapper,
#debug-wrapper,
#eruda-wrapper {
	@apply fixed z-[9999];
}

#debug-wrapper {
	@apply right-10 top-20 w-80;
}

#stats-wrapper {
	@apply left-1 top-20;
}

#eruda-wrapper {
	@apply bottom-0 w-full;
}
</style>
