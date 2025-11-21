<template>
	<div class="explore-dummy">
		<Transition name="fade">
			<picture v-show="!isLoading" class="pic">
				<img
					class="img"
					:src="imgUrl"
					alt=""
					loading="lazy"
					decoding="async"
					draggable="false"
					ref="imageRef"
				/>
			</picture>
		</Transition>
	</div>
</template>

<script setup>
import { useImage } from '@vueuse/core'

const imgUrl = '/images/explore-dummy.webp'
const { isLoading } = useImage({ src: imgUrl })
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
