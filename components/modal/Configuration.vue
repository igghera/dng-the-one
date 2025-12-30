<template>
	<div class="modal-configuration">
		<div class="inner" ref="innerRef">
			<button class="close-button" @click="close">
				<IconClose class="size-7" />
			</button>

			<header class="header">
				<h2 class="title" v-html="$t('modal_configuration.title')" />
			</header>

			<ul class="controls">
				<li class="control">
					<span class="control-label">{{
						$t('modal_configuration.options.0.label')
					}}</span>

					<div class="control-buttons">
						<ButtonGolden
							class="control-button"
							:class="{
								'opacity-50': !printEnabled,
							}"
							size="square"
							@click="printEnabled = true"
						>
							{{ $t('modal_configuration.options.0.options.0') }}
						</ButtonGolden>

						<ButtonGolden
							class="control-button"
							:class="{
								'opacity-50': printEnabled,
							}"
							size="square"
							@click="printEnabled = false"
						>
							{{ $t('modal_configuration.options.0.options.1') }}
						</ButtonGolden>
					</div>
				</li>
			</ul>

			<ButtonGolden class="submit" size="wide" @click="close">
				{{ $t('done') }}
			</ButtonGolden>
		</div>
	</div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'

//
// Refs / State
//
const uiStore = useUiStore()

const innerRef = useTemplateRef('innerRef')

const printEnabled = useStorage(STORAGE_LABELS.PRINT_ENABLED, false)

//
// Misc
//
onClickOutside(innerRef, evt => {
	evt.target.tagName !== 'MAIN' && close()
})

//
// Methods
//
const close = () => {
	uiStore.setConfigPanelVisible(false)
}
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

.modal-configuration {
	@apply grid fixed z-[60] inset-0 bg-black/10 backdrop-blur-[8px];

	grid-template-areas:
		'. . .'
		'. a .'
		'. . .';
	grid-template-columns: minmax(auto, 30px) 1fr minmax(auto, 30px);
	grid-template-rows: 1fr auto 1fr;
}

.inner {
	@apply grid self-center justify-self-center justify-items-center text-center text-old-study bg-white rounded-[30px];
	@apply p-10;

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
	width: min(80%, toRem(720));
}

.close-button {
	@apply justify-self-end self-start -translate-y-1/2 translate-x-1/2;

	grid-area: a;
}

.header {
	grid-area: a;
}

.title {
	@apply uppercase font-medium leading-[0.9] tracking-[0.05em];

	font-size: toRem(42);
}

.controls {
	@apply justify-self-stretch;

	grid-area: b;
}

.control {
	@apply flex justify-between items-center;
}

.control-label {
	@apply text-xs leading-none uppercase tracking-[0.05em] font-body font-medium;
}

.control-buttons {
	@apply flex gap-4;
}

.control-button {
	@apply text-sm leading-none uppercase tracking-[0.05em] font-body font-medium text-old-study;

	text-shadow: none !important;
}

.submit {
	@apply text-old-study;

	grid-area: c;
	text-shadow: none !important;
}
</style>
