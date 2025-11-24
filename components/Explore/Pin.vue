<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 45 45">
		<circle
			cx="22.5"
			cy="22.5"
			r="21.938"
			stroke="#ffdba5"
			stroke-opacity=".4"
			stroke-width="1.125"
		/>
		<g :filter="`url(#shadow-${uid})`">
			<circle cx="22.5" cy="22.5" r="5.625" fill="#ffdba5" />
		</g>
		<defs>
			<filter
				:id="`shadow-${uid}`"
				width="19.25"
				height="19.25"
				x="12.875"
				y="16.875"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset dy="4" />
				<feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
				<feBlend
					in2="BackgroundImageFix"
					result="effect1_dropShadow_726_6375"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect1_dropShadow_726_6375"
					result="shape"
				/>
			</filter>
		</defs>
	</svg>
</template>

<script setup>
const uid = useId()
</script>

<style lang="scss" scoped>
.pin {
	@apply size-full;
}
</style>
