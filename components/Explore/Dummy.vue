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
	</div>
</template>

<script setup>
import { get, useImage } from '@vueuse/core'

//
// Refs / State
//
const { gsap } = useGSAP()

const picRef = useTemplateRef('picRef')

const imgUrl = '/images/explore-dummy.webp'
const { isLoading } = useImage({ src: imgUrl })

watchOnce(isLoading, loading => {
	gsap.delayedCall(1, () => {
		animateIn()
	})
})

const animateIn = () => {
	gsap.fromTo(
		get(picRef),
		{
			transformOrigin: '1% 95%',
		},
		{
			duration: 2.5,
			ease: 'expo.inOut',
			scale: 4,
		}
	)
}
</script>

<style lang="scss" scoped>
.explore-dummy {
	@apply h-[100svh] overflow-clip grid items-center justify-center;
}

.pic {
	@apply block w-full aspect-[5308/2961];
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
