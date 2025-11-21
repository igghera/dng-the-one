<template>
	<ExploreDummy />
</template>

<script setup>
const uiStore = useUiStore()

onMounted(() => {
	uiStore.setMainUiVisible(true)
})
</script>
