<template>
	<Container>
		<header class="header">
			<h2
				class="display-2 | text-gold"
				v-html="$t('experience_enter_name.title')"
			/>
		</header>

		<form class="form">
			<div class="input-wrapper">
				<input
					class="input"
					type="text"
					name="username"
					autocomplete="off"
					:placeholder="$t('experience_enter_name.input_palceholder')"
					ref="inputRef"
				/>
			</div>
		</form>

		<ButtonGolden class="button" size="square">
			<IconArrowRight class="w-4" />
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get } from '@vueuse/core'

//
// Refs / State
//
const el = useCurrentElement()
const inputRef = useTemplateRef('inputRef')

const isVisible = useElementVisibility(el)

//
// Watchers
//
watchEffect(() => {
	if (get(isVisible)) get(inputRef)?.focus()
})
</script>

<style lang="scss" scoped>
@use '@/assets/css/functions' as *;

:deep(.site-grid) {
	--cols: 1;

	@apply justify-items-center;

	grid-template-areas:
		'a'
		'b'
		'c';
	grid-template-rows: auto 1fr auto;
}

.header {
	@apply text-center uppercase;

	grid-area: a;
}

.form {
	@apply self-center;

	grid-area: b;
}

.input-wrapper {
	@apply border-b border-gold/80 border-solid p-3;
	@apply lg:py-7 lg:px-12;
}

.input {
	@apply text-center appearance-none bg-transparent placeholder:text-white/30 outline-none w-32;
	@apply lg:w-44;
}

.button {
	@apply self-center;

	grid-area: c;
}
</style>
