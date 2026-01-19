<template>
	<div class="modal-qr-code">
		<div class="inner" ref="innerRef">
			<button class="close-button" @click="close">
				<IconClose class="size-7" />
			</button>

			<header class="header">
				<h2 class="title" v-html="$t('modal_qr_code.title')" />
			</header>

			<div class="qr-wrapper" ref="qrWrapperRef" />
		</div>
	</div>
</template>

<script setup>
import QRCodeStyling from 'qr-code-styling'
import { get } from '@vueuse/core'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { locale } = useI18n()

const config = useRuntimeConfig()

const innerRef = useTemplateRef('innerRef')
const qrWrapperRef = useTemplateRef('qrWrapperRef')

const qrCodeOptions = {
	type: 'canvas',
	shape: 'square',
	width: 220,
	height: 220,
	margin: 0,
	qrOptions: { typeNumber: '0', mode: 'Byte', errorCorrectionLevel: 'Q' },
	imageOptions: {
		saveAsBlob: true,
		hideBackgroundDots: true,
		imageSize: 0.6,
		margin: 8,
	},
	dotsOptions: {
		type: 'square',
		color: '#ffffff',
		roundSize: true,
		gradient: null,
	},
	backgroundOptions: { round: 0, color: '#ffffff00', gradient: null },
	image:
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALsAAACHCAYAAABOKCi8AAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMTM1IgogICB0aWZmOkltYWdlV2lkdGg9IjE4NyIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iMjg4LzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjI4OC8xIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTg3IgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTM1IgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIw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',
	dotsOptionsHelper: {
		colorType: { single: true, gradient: false },
		gradient: {
			linear: true,
			radial: false,
			color1: '#6a1a4c',
			color2: '#6a1a4c',
			rotation: '0',
		},
	},
	cornersSquareOptions: { type: '', color: '#ffffff' },
	cornersSquareOptionsHelper: {
		colorType: { single: true, gradient: false },
		gradient: {
			linear: true,
			radial: false,
			color1: '#000000',
			color2: '#000000',
			rotation: '0',
		},
	},
	cornersDotOptions: { type: 'square', color: '#ffffff' },
	cornersDotOptionsHelper: {
		colorType: { single: true, gradient: false },
		gradient: {
			linear: true,
			radial: false,
			color1: '#000000',
			color2: '#000000',
			rotation: '0',
		},
	},
	backgroundOptionsHelper: {
		colorType: { single: true, gradient: false },
		gradient: {
			linear: true,
			radial: false,
			color1: '#ffffff',
			color2: '#ffffff',
			rotation: '0',
		},
	},
}

//
// Lifecycle
//
onMounted(async () => {
	await nextTick()

	generateQrCode()
})

//
// Misc
//
onClickOutside(innerRef, () => {
	close()
})

//
// Methods
//
const close = () => {
	uiStore.setQrCodeModalVisible(false)
}

const generateQrCode = () => {
	const q1 = appStore.getStep01Selection ?? 0
	const q2 = appStore.getStep02Selection ?? 0
	const q3 = appStore.getStep03Selection ?? 0

	const baseUrl = config.public.isAppMode
		? config.public.siteUrl
		: window.location.origin

	const data = `${baseUrl}/download?q1=${q1}&q2=${q2}&q3=${q3}&locale=${get(locale)}`

	console.info('⚠️ Generated QR code:', data)

	const qr = new QRCodeStyling({
		...qrCodeOptions,
		data,
	})

	qr.append(get(qrWrapperRef))
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
	background-image:
		linear-gradient(#8c3610, #3c1707),
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
		'c';
	grid-template-columns: 1fr;
	grid-template-rows:
		auto
		toRem(50)
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

.qr-wrapper {
	@apply size-60 aspect-square flex items-center justify-center justify-self-center relative;

	grid-area: c;

	&::after {
		@apply block content-[''] absolute inset-0 mix-blend-darken;

		background: linear-gradient(
			149.14deg,
			#f5d982 8.93%,
			#ffffc4 46.7%,
			#f5d982 88.29%
		);
	}
}
</style>
