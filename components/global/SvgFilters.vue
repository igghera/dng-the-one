<template>
	<svg id="svg-filters" xmlns="http://www.w3.org/2000/svg" fill="none">
		<defs>
			<filter
				id="dot-glow"
				width="300"
				height="300"
				x="-150"
				y="-150"
				color-interpolation-filters="sRGB"
				filterUnits="userSpaceOnUse"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="4.764" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="BackgroundImageFix"
					result="effect1_dropShadow_1698_5905"
				/>
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="9.528" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="effect1_dropShadow_1698_5905"
					result="effect2_dropShadow_1698_5905"
				/>
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="33.349" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="effect2_dropShadow_1698_5905"
					result="effect3_dropShadow_1698_5905"
				/>
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="66.698" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="effect3_dropShadow_1698_5905"
					result="effect4_dropShadow_1698_5905"
				/>
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="76.247" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="effect4_dropShadow_1698_5905"
					result="effect5_dropShadow_1698_5905"
				/>
				<feColorMatrix
					in="SourceAlpha"
					result="hardAlpha"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="76.247" />
				<feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
				<feBlend
					in2="effect5_dropShadow_1698_5905"
					result="effect6_dropShadow_1698_5905"
				/>
				<feBlend
					in="SourceGraphic"
					in2="effect6_dropShadow_1698_5905"
					result="shape"
				/>
			</filter>
		</defs>
	</svg>
</template>
