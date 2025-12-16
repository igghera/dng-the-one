<template>
	<component
		:is="componentTag"
		class="button-golden | ui-3 text-shadow"
		:to="to"
		:data-size="size"
	>
		<span class="glow" aria-hidden="true" />

		<span class="text">
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
// Refs / State
//
const { gsap, Observer } = useGSAP()

const mouseX = shallowRef(0)
const mouseY = shallowRef(0)

let mouseObserver = null

//
// Lifecycle
//
onMounted(() => {
	const mm = gsap.matchMedia()

	mm.add(
		{
			isDesktop: '(min-width: 1024px)',
			isMobile: '(max-width: 1023px)',
		},
		context => {
			const { isDesktop } = context.conditions

			if (isDesktop) {
				mouseObserver = Observer.create({
					onMove(observer) {
						const { x, y } = observer

						gsap.to(mouseX, {
							value: x,
							duration: 0.3,
							ease: 'power2.out',
							overwrite: true,
						})

						gsap.to(mouseY, {
							value: y,
							duration: 0.3,
							ease: 'power2.out',
							overwrite: true,
						})
					},
				})
			} else {
				mouseObserver?.kill()
			}
		}
	)
})

onBeforeUnmount(() => {
	mouseObserver?.kill()
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
	@apply uppercase text-white flex items-center justify-center text-center overflow-clip relative;

	animation: golden-button-animation 4.5s linear infinite;
	background-repeat: repeat-x;
	background-size: 400px 100%;
	background-image: repeating-linear-gradient(
		98deg,
		rgba(215, 154, 59, 0.35) -14px,
		rgba(255, 214, 122, 0.35) 44px,
		rgba(215, 154, 59, 0.35) 100px,
		rgba(255, 214, 122, 0.35) 160px,
		rgba(215, 154, 59, 0.35) 214px
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
}

.glow {
	@apply absolute z-[1] aspect-square size-full pointer-events-none bg-fixed;
	@apply lg-down:hidden;

	background-image: radial-gradient(
		circle at v-bind('`${mouseX}px`') v-bind('`${mouseY}px`'),
		rgba(255, 255, 255, 0.25) 0px,
		rgba(255, 255, 255, 0.25) 20px,
		rgba(255, 255, 255, 0) 100px
	);
}

.text {
	@apply relative z-[2] pointer-events-none;

	filter: drop-shadow(0px 3px 10px #764800a6);
}

@keyframes golden-button-animation {
	from {
		background-position: -20px 50%;
	}

	to {
		background-position: -134px 50%;
	}
}
</style>
