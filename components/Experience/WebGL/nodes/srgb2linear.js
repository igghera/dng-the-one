import { Fn, step, mix, vec4 } from 'three/tsl'

export const srgb2linear = Fn(([color]) => {
  const value = color.rgb
  const alpha = color.a

  const a = value.div(12.92)
  const b = value.add(0.055).div(1.055).pow(2.4)
  const t = step(0.04045, value)

  return vec4(mix(a, b, t), alpha)
})
