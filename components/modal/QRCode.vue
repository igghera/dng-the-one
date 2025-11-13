<template>
	<div class="modal-qr-code">
		<div class="inner" ref="innerRef">
			<button class="close-button" @click="close">
				<IconClose class="size-7" />
			</button>

			<header class="header">
				<h2 class="title" v-html="$t('modal_qr_code.title')" />
			</header>

			<p class="copy" v-html="$t('modal_qr_code.copy')" />
		</div>
	</div>
</template>

<script setup>
const uiStore = useUiStore()

const innerRef = useTemplateRef('innerRef')

onClickOutside(innerRef, () => {
	close()
})

const close = () => {
	uiStore.setQrCodeModalVisible(false)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.modal-qr-code {
	@apply grid fixed z-50 inset-0 backdrop-blur-[8px] text-gold text-center;

	grid-template-areas:
		'. . .'
		'. a .'
		'. . .';
	grid-template-columns: minmax(auto, 30px) 1fr minmax(auto, 30px);
	grid-template-rows: 1fr auto 1fr;
}

.inner {
	@apply grid self-center justify-self-center text-center;

	background-clip: padding-box, border-box;
	background-origin: border-box;
	background-image: linear-gradient(#8c3610, #3c1707),
		linear-gradient(
			147.91deg,
			#f5d982 0.03%,
			rgba(245, 217, 130, 0) 47.62%,
			rgba(245, 217, 130, 0) 67.33%,
			#f5d982 100.03%
		);
	border: 1px solid transparent;
	border-image: var(--border-color) 1;
	border-radius: toRem(30);
	grid-area: a;
	grid-template-areas:
		'a'
		'.'
		'b'
		'.'
		'c'
		'.'
		'd';
	grid-template-columns: 1fr;
	grid-template-rows:
		auto
		toRem(50)
		auto
		toRem(60)
		auto
		toRem(60)
		auto;
	padding: toRem(36) toRem(36) toRem(88);
	width: min(80%, toRem(535));
}

.close-button {
	@apply justify-self-end;

	grid-area: a;
}

.header {
	grid-area: b;
}

.title {
	@apply uppercase leading-none tracking-[0.05em];

	font-size: toRem(26);
}

.copy {
	@apply leading-none tracking-[0.05em];

	font-size: toRem(20);
	grid-area: d;
}
</style>
