<template>
	<component
		:is="componentTag"
		class="button-golden | ui-3"
		:to="to"
		:data-size="size"
	>
		<span>
			<slot />
		</span>
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

	animation: golden-button-animation 4.5s linear infinite;
	background-repeat: repeat-x;
	background-size: 200% 100%;
	background-image: repeating-linear-gradient(
		98deg,
		rgba(215, 154, 59, 0.35) -3.525%,
		rgba(255, 214, 122, 0.35) 10.92%,
		rgba(215, 154, 59, 0.35) 24.805%,
		rgba(255, 214, 122, 0.35) 39.805%,
		rgba(215, 154, 59, 0.35) 53.695%
	);
	border: toRem(1.3) solid var(--Stroke-button, #ffffc433);
	border-radius: toRem(10);
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

	& > span {
		filter: drop-shadow(0px 3px 10px #764800a6);
	}
}

@keyframes golden-button-animation {
	from {
		background-position: 0% 50%;
	}

	to {
		background-position: 60% 50%;
	}
}
</style>
