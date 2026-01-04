import {
  opacity as particlesOpacity,
  strength as particlesStrength,
	speed as particlesSpeed,
	sizeMax as particlesSizeMax
} from './materials/particles'

import {
	opacity as godraysOpacity,
	smoothBottom as godraysSmoothBottom,
  scaleTop as godraysScaleTop,
	scaleBottom as godraysScaleBottom,
	timeSpeed as godraysTimeSpeed,
	obstructionScale as godraysObstructionScale
} from './materials/godrays'

import { gsap } from 'gsap'

export const animateInGodrays = () => {
  gsap.to(particlesOpacity, {
    value: 1,
    duration: 2,
    overwrite: true,
  })

  gsap.to(godraysOpacity, {
    value: 0.25,
    duration: 2,
    overwrite: true,
  })

  gsap.to(godraysSmoothBottom, {
    value: 0.15,
    duration: 3.5,
    overwrite: true,
  })
}

export const animateGodrays = stepIndex => {
  let strength = 0
  let speed = 0
  let sizeMax = 0

  let radiusTop = 0
  let radiusBottom = 0

  let obstructionScale = 1
  let timeSpeed = 0

  switch (stepIndex) {
		case 0:
			strength = 0.23
			speed = 0.1
			sizeMax = 0.035

			radiusTop = 0.4
			radiusBottom = 0.4
			break
		case 1:
			strength = 0.35
			speed = 0.16
			sizeMax = 0.048

			radiusTop = 0.5
			radiusBottom = 0.9
			break
		case 2:
			strength = 0.48
			speed = 0.21
			sizeMax = 0.056

			radiusTop = 0.8
			radiusBottom = 1.75

			obstructionScale = 0
			timeSpeed = 0.07
			break
		case 3:
			strength = 0.65
			speed = 0.26
			sizeMax = 0.065

			radiusTop = 1.2
			radiusBottom = 2.35

			obstructionScale = 0
			timeSpeed = 0.07
			break
	}

  gsap.to(particlesStrength, {
		value: strength,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(particlesSpeed, {
		value: speed,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(particlesSizeMax, {
		value: sizeMax,
		duration: 2,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysScaleTop, {
		value: radiusTop,
		duration: 1.6,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysScaleBottom, {
		value: radiusBottom,
		duration: 1.6,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysObstructionScale, {
		value: obstructionScale,
		duration: 1,
		overwrite: true,
		ease: 'sine.out',
	})

	gsap.to(godraysTimeSpeed, {
		value: timeSpeed,
		duration: 1.5,
		overwrite: true,
		ease: 'sine.out',
	})
}
