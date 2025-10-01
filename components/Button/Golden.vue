<template>
	<component
		:is="componentTag"
		class="button-golden | ui-3"
		:to="to"
		:data-size="size"
	>
		<slot />
	</component>
</template>

<script setup>
//
// Props
//
const props = defineProps({
	to: {
		type: String,
		required: false,
	},
	size: {
		type: String,
		required: false,
		default: 'auto',
		validator: value => ['auto', 'square', 'wide'].includes(value),
	},
})

//
// Computed
//
const componentTag = computed(() => {
	if (props.to) return resolveComponent('NuxtLink')

	return 'button'
})
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.button-golden {
	@apply uppercase text-white flex items-center justify-center text-center overflow-clip;

	background: linear-gradient(
		98deg,
		rgba(215, 154, 59, 0.35) -7.05%,
		rgba(255, 214, 122, 0.35) 21.84%,
		rgba(215, 154, 59, 0.35) 49.61%,
		rgba(255, 214, 122, 0.35) 79.61%,
		rgba(215, 154, 59, 0.35) 107.39%
	);
	border: toRem(1.3) solid var(--Stroke-button, #ffffc433);
	border-radius: toRem(10);
	box-shadow: 0px 3px 10px 0px #764800a6;
	height: toRem(50);

	@screen md {
		height: toRem(60);
	}

	&[data-size='auto'] {
		@apply px-5;
	}

	&[data-size='square'] {
		@apply size-[50px];
	}

	&[data-size='wide'] {
		padding: 0 toRem(75);
	}
}
</style>
