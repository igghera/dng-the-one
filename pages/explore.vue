<template>
	<div>
		<ClientOnly>
			<Explore v-if="isDebug" />
			<ExploreDummy v-else />
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
