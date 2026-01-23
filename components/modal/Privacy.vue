<template>
	<div class="modal-privacy">
		<div class="inner" ref="innerRef">
			<button class="close-button" @click="close">
				<IconClose class="size-7" />
			</button>

			<header class="header">
				<h2 class="title" v-html="$t('modal_privacy.title')" />
			</header>

			<div class="content" data-lenis-prevent>
				<div class="content-inner">
					<template v-for="(row, idx) in content" :key="idx">
						<header v-if="row.type === 'headline'" class="headline">
							<h3>{{ row.body }}</h3>
						</header>

						<p
							v-if="row.type === 'paragraph'"
							class="paragraph"
							v-html="row.body"
						/>

						<ol v-if="row.type === 'ordered_list'" class="ordered-list">
							<li v-for="(item, idx) in row.items" :key="idx">
								{{ item }}
							</li>
						</ol>
					</template>
				</div>
			</div>
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

const { locale, rt, tm } = useI18n()

const config = useRuntimeConfig()

const innerRef = useTemplateRef('innerRef')

const content = computed(() => {
	return tm('modal_privacy.content').map(item => {
		return {
			type: rt(item.type),
			body: item.body ? rt(item.body) : null,
			items: item.items ? item.items.map(i => rt(i)) : null,
		}
	})
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
	uiStore.setPrivacyModalVisible(false)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.modal-privacy {
	@apply grid fixed z-50 inset-0 backdrop-blur-[8px] text-gold text-center;

	grid-template-areas:
		'. . .'
		'. a .'
		'. . .';
	grid-template-columns: minmax(auto, 30px) 1fr minmax(auto, 30px);
	grid-template-rows: toRem(120) auto toRem(100);
}

.inner {
	@apply grid self-center justify-self-center text-left size-full overflow-hidden relative;

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
		toRem(20)
		auto
		toRem(28)
		auto;
	max-width: 1200px;
	padding: toRem(36) toRem(4) 0;

	&::after {
		@apply block content-[''] absolute bottom-0 inset-x-0 h-36 pointer-events-none;

		--hdr-gradient: linear-gradient(
			to top in oklab,
			oklch(0.26 0.06 42.52) 10%,
			oklch(0.26 0.06 42.52 / 0%)
		);

		background: var(--hdr-gradient);
	}
}

.close-button {
	@apply justify-self-end right-9 relative;

	grid-area: a;
}

.header {
	grid-area: b;
	padding: 0 toRem(36);
}

.title {
	@apply uppercase leading-none tracking-[0.05em];

	font-size: toRem(20);
}

.content {
	@apply overflow-auto leading-none tracking-[0.05em];

	font-size: toRem(15);
	grid-area: c;
	scrollbar-color: theme('colors.gold-light') transparent;
	scrollbar-width: 4px;
}

.content-inner {
	@apply flex flex-col gap-y-6;

	padding: 0 toRem(36) toRem(88);

	:deep(.headline),
	:deep([data-type='headline']) {
		@apply uppercase;

		font-size: toRem(18);
	}

	:deep(.subheadline),
	:deep([data-type='subheadline']) {
		@apply uppercase;

		font-size: toRem(14);
	}

	:deep(.ordered-list),
	:deep([data-type='ordered-list']) {
		@apply list-decimal list-inside;
	}

	:deep(:not(.headline) + .headline) {
		@apply pt-6;
	}
}
</style>
