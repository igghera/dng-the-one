<template>
	<component :is="tag" class="site-container | flex px-5 md:px-[50px]">
		<div class="site-grid | w-full max-w-[1440px] mx-auto">
			<slot />
		</div>
	</component>
</template>

<script setup>
defineProps({
	tag: {
		type: String,
		default: 'section',
		validator: value =>
			['section', 'div', 'header', 'footer', 'nav'].includes(value),
	},
})
</script>
