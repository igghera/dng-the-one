<template>
	<div class="explore-dummy">
		<Transition name="fade">
			<picture v-show="!isLoading" class="pic" ref="picRef">
				<img
					class="img"
					:src="imgUrl"
					alt=""
					loading="lazy"
					decoding="async"
					draggable="false"
				/>
			</picture>
		</Transition>

		<div class="pic-target" ref="picTargetRef"></div>
	</div>
</template>

<script setup>
import { get, useImage } from '@vueuse/core'

//
// Refs / State
//
const { gsap, Flip, Draggable } = useGSAP()

const el = useCurrentElement()
const picRef = useTemplateRef('picRef')
const picTargetRef = useTemplateRef('picTargetRef')

const imgUrl = '/images/explore-dummy.webp'
const { isLoading } = useImage({ src: imgUrl })

let draggableInstance = null

//
// Lifecycle
//
onBeforeUnmount(() => {
	draggableInstance?.[0]?.kill()
})

//
// Watchers
//
watchOnce(isLoading, () => {
	gsap.delayedCall(1, async () => {
		await animateIn()
		createDraggable()
	})
})

//
// Methods
//
const animateIn = () => {
	const state = Flip.getState(get(picRef))

	get(picTargetRef).appendChild(get(picRef))

	return Flip.from(state, {
		duration: 2.5,
		ease: 'expo.inOut',
	})
}

const createDraggable = () => {
	draggableInstance = Draggable.create(get(picRef), {
		bounds: get(el),
		zIndexBoost: false,
	})
}
</script>

<style lang="scss" scoped>
.explore-dummy {
	@apply h-[100svh] overflow-clip grid items-center justify-center;
}

.pic {
	@apply col-start-1 row-start-1 block w-full aspect-[5308/2961];
}

.pic-target {
	@apply col-start-1 row-start-1 grid items-center justify-start size-full overflow-hidden;

	:deep(.pic) {
		@apply h-full;
	}
}

.img {
	@apply size-full object-contain object-center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
