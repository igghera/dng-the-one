<template>
	<svg
		class="w-[0.375rem] lg:w-2"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 8 450"
		overflow="visible"
	>
		<path
			class="stroke-gold-light"
			stroke-dasharray="1.5 18"
			stroke-dashoffset="0"
			stroke-width="8"
			d="M4 0v450"
		/>

		<circle
			v-for="(dot, idx) in dotsCoords"
			:key="idx"
			class="fill-gold-light"
			:cx="dot.x"
			:cy="dot.y"
			r="10"
		/>
	</svg>
</template>

<script setup>
const dotsCoords = [
	{ x: 4, y: -17 },
	{ x: 4, y: 136 },
	{ x: 4, y: 293 },
	{ x: 4, y: 450 },
]
</script>
