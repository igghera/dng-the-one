<template>
	<ButtonGolden @click="handleClick">
		<IconRestart class="size-6" />
	</ButtonGolden>
</template>

<script setup>
const props = defineProps({
	to: {
		type: String,
		required: false,
	},
})

const handleClick = async () => {
	Tracking.sendEvent({
		generic_event_and_label: 'play_again',
		customizator_option: 'play-again',
	})

	await nextTick()

	if (props.to) {
		await navigateTo(props.to, {
			open: {
				target: '_self',
			},
		})
	} else {
		window.location.reload()
		// emitter.emit(EVENTS.RESTART)
	}
}
</script>
