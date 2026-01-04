import { uniform } from 'three/tsl'

export const thresholdA = 1
export const thresholdB = 1.4

export const strengthDesktop = 1
export const radiusDesktop = 1.3
export const strengthMobile = 0.8
export const radiusMobile = 0.55

export const threshold = uniform(thresholdA)
export const strength = uniform(strengthDesktop)
export const radius = uniform(radiusDesktop)
