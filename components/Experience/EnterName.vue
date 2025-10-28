<template>
	<Container class="pointer-events-none">
		<header class="header" style="opacity: 0" ref="headerRef">
			<h2
				class="display-2 | golden-text"
				v-html="$t('experience_enter_name.title')"
			/>
		</header>

		<form
			class="form"
			style="opacity: 0"
			@submit.prevent="handleSubmit"
			ref="formRef"
		>
			<div class="input-wrapper">
				<input
					class="input | body-3"
					type="text"
					name="username"
					minlength="3"
					autocomplete="off"
					required
					:placeholder="$t('experience_enter_name.input_palceholder')"
					ref="inputRef"
					@input="handleInput"
				/>
			</div>

			<ButtonGolden
				class="button"
				size="square"
				:data-visible="continueButtonVisible"
				type="submit"
			>
				<IconArrowRight class="w-4" />
			</ButtonGolden>
		</form>
	</Container>
</template>

<script setup>
import { get, set } from '@vueuse/core'

//
// Refs / State
//
const appStore = useAppStore()
const uiStore = useUiStore()

const { gsap } = useGSAP()

const el = useCurrentElement()
const headerRef = useTemplateRef('headerRef')
const formRef = useTemplateRef('formRef')
const inputRef = useTemplateRef('inputRef')

const isVisible = useElementVisibility(el)

const { isMobile } = useViewport()

const continueButtonVisible = ref(false)

const inputMinWidthMobile = 128
const inputMinWidthDesktop = 176

//
// Watchers
//
watch(isVisible, visible => {
	if (visible) {
		gsap.fromTo(
			[get(headerRef), get(formRef)],
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 1,
				stagger: 0.1,
				onComplete: () => {
					get(inputRef)?.focus()
				},
			}
		)
	} else {
		gsap.set([get(headerRef), get(formRef)], { opacity: 0 })
	}
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

const setContinueButtonVisible = () => {
	set(continueButtonVisible, appStore.getUsername.length >= 3)
}

const handleSubmit = () => {
	uiStore.setExperienceEnterNameVisible(false)
	uiStore.setExperienceStep01Visible(true)
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
	@apply grid grid-rows-subgrid justify-items-center pointer-events-auto;

	grid-area: b / c;

	&:has(.input:not(:valid)) {
		.button {
			@apply pointer-events-none opacity-0;
		}
	}
}

.input-wrapper {
	@apply border-b border-gold/80 border-solid p-3 self-center;
	@apply lg:py-7 lg:px-12;

	grid-area: b;
}

.input {
	@apply text-center appearance-none bg-transparent placeholder:text-white/30 outline-none w-32 uppercase;
	@apply lg:w-44;
}

.button {
	@apply self-end pointer-events-auto;
	@apply duration-500 ease-out;

	grid-area: c;
}
</style>
