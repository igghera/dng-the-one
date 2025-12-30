<template>
	<Container class="pointer-events-none">
		<header class="header | text-shadow" style="opacity: 0" ref="headerRef">
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
			<fieldset class="input-wrapper" :disabled="!canSubmit">
				<input
					v-model="appStore.username"
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
			</fieldset>

			<ButtonGolden class="button | !text-gold" size="square" type="submit">
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
const trackingStore = useTrackingStore()

const { gsap } = useGSAP()

const el = useCurrentElement()
const headerRef = useTemplateRef('headerRef')
const formRef = useTemplateRef('formRef')
const inputRef = useTemplateRef('inputRef')

const isVisible = useElementVisibility(el)

const submitButtonVisible = ref(false)
const canSubmit = shallowRef(false)

const inputMinWidth = 176

//
// Watchers
//
watch(isVisible, visible => {
	if (visible) {
		uiStore.setBottomGradientVisible(false)

		gsap.fromTo(
			[get(headerRef), get(formRef)],
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 1,
				stagger: 0.1,
				onStart: async () => {
					set(canSubmit, true)
					await nextTick()
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
const handleInput = async () => {
	setSubmitButtonVisible()
}

const setSubmitButtonVisible = () => {
	set(submitButtonVisible, appStore.getUsername.length >= 3)
}

const handleSubmit = async () => {
	Tracking.sendEvent({
		generic_event_and_label: 'next',
	})
	// trackingStore.setFunnel('2')

	set(canSubmit, false)

	await animateOut()

	uiStore.setExperienceEnterNameVisible(false)
	emitter.emit(EVENTS.TRIGGER_FLASH_EFFECT)

	gsap.delayedCall(0.1, () => {
		emitter.emit(EVENTS.ANIMATE_IN_MAIN_SCENE)
	})
}

async function animateOut() {
	const tl = gsap.timeline({ paused: true })
	tl.addLabel('start')

	tl.to(
		[get(headerRef), get(formRef)],
		{ opacity: 0, duration: 0.5, stagger: 0.2 },
		'start'
	)

	return tl.play()
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
	@apply grid gap-x-6 justify-items-center items-center self-center pointer-events-auto;

	transition-duration: 1s, 1s;
	transition-property: grid-template-columns, column-gap;

	grid-area: b / c;
	grid-template-columns: 1fr 50px;

	&:has(.input:not(:valid)) {
		column-gap: 0;
		grid-template-columns: 1fr 0px;
		transition-delay: 200ms;

		.button {
			@apply pointer-events-none opacity-0 delay-0;

			transition-duration: 500ms;
		}
	}
}

.input-wrapper {
	@apply border-b border-gold/80 border-solid p-3 self-center justify-self-center col-span-1 row-start-1;
	@apply lg:py-7 lg:px-12;
}

.input {
	@apply text-center appearance-none bg-transparent placeholder:text-gold/50 outline-none w-44 uppercase;
}

.button {
	@apply pointer-events-auto col-start-2 row-start-1;
	@apply transition-opacity duration-1000 delay-200;
}
</style>
