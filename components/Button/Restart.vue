<template>
	<ButtonGolden @click="handleClick">
		<IconRestart class="size-6" />
	</ButtonGolden>
</template>

<script setup>
const handleClick = () => {
	emitter.emit(EVENTS.RESTART)
}
</script>
