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
	if (props.to) {
		await navigateTo(props.to, {
			open: {
				target: '_self',
			},
		})
	} else {
		emitter.emit(EVENTS.RESTART)
	}
}
</script>
