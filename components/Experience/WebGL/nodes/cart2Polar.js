import { Fn, vec2, length, atan } from 'three/tsl'

export const cart2Polar = Fn(([uv]) => {
  const radius = length(uv)
  const angle = atan(uv.y, uv.x)

  return vec2(radius, angle)
})
