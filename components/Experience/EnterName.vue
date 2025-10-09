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
					class="input | body-3"
					type="text"
					name="username"
					autocomplete="off"
					:placeholder="$t('experience_enter_name.input_palceholder')"
					ref="inputRef"
					@input="handleInput"
				/>
			</div>
		</form>

		<ButtonGolden
			class="button"
			size="square"
			:data-visible="continueButtonVisible"
		>
			<IconArrowRight class="w-4" />
		</ButtonGolden>
	</Container>
</template>

<script setup>
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const appStore = useAppStore()

const el = useCurrentElement()
const inputRef = useTemplateRef('inputRef')

const isVisible = useElementVisibility(el)

const { isMobile } = useViewport()

const continueButtonVisible = ref(false)

const inputMinWidthMobile = 128
const inputMinWidthDesktop = 176

//
// Watchers
//
watchEffect(() => {
	if (get(isVisible)) get(inputRef)?.focus()
})

//
// Methods
//
const handleInput = () => {
	appStore.setUsername(get(inputRef)?.value)

	setContinueButtonVisible()

	const dummy = document.createElement('span')
	Object.assign(dummy.style, {
		position: 'fixed',
		top: '0',
		left: '-9999px',
		textTransform: 'uppercase',
	})
	dummy.innerHTML = get(inputRef)?.value

	document.body.appendChild(dummy)

	const targetMinWidth = get(isMobile)
		? inputMinWidthMobile
		: inputMinWidthDesktop

	get(inputRef).style.width = `${Math.max(targetMinWidth, dummy.clientWidth)}px`

	dummy.remove()
}

function setContinueButtonVisible() {
	set(continueButtonVisible, appStore.getUsername.length >= 3)
}
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
	@apply text-center appearance-none bg-transparent placeholder:text-white/30 outline-none w-32 uppercase;
	@apply lg:w-44;
}

.button {
	@apply self-center;
	@apply duration-500 ease-out;

	grid-area: c;

	&[data-visible='false'] {
		@apply pointer-events-none opacity-0;
	}
}
</style>
