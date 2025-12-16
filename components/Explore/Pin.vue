<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 45 45">
		<circle
			cx="22.5"
			cy="22.5"
			r="21.938"
			stroke="#ffdba5"
			stroke-opacity=".4"
			stroke-width="1.125"
		/>

		<circle cx="22.5" cy="22.5" r="5.625" fill="#ffdba5" />
	</svg>
</template>

<script setup>
const uid = useId()
</script>

<style lang="scss" scoped>
.pin {
	@apply size-full;
}
</style>
