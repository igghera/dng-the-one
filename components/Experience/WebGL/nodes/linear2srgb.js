import { Fn, step, mix, vec4 } from 'three/tsl'

export const linear2srgb = Fn(([color]) => {
  const value = color.rgb
  const alpha = color.a

  const a = value.mul(12.92)
  const b = value.pow(1.0 / 2.4).mul(1.055).sub(0.055)
  const t = step(0.0031308, value)

  return vec4(mix(a, b, t), alpha)
})
