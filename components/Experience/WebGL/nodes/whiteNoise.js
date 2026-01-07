import { Fn, vec2, fract, sin, dot } from 'three/tsl'

export const whiteNoise = Fn(([p]) => {
  return fract(sin(dot(p, vec2(12.9898, 78.233))).mul(43758.5453))
}, { p: 'vec2', return: 'float' })
