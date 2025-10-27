import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, uniform, vec2, vec4, uv, step, screenSize, abs, length, max, min, remap, color } from 'three/tsl'

export const progress = uniform(1)
export const radius = uniform(0.1)
export const borderWidth = uniform(0.007)
export const maskColorA = uniform(color(0.58, 0.41, 0.05))
export const maskColorB = uniform(color(0.47, 0.21, 0.06))

export const MaskMaterial = new MeshBasicNodeMaterial({
  color: 0xffffff
})

const sdfRoundedRect = Fn(( [p, size, r] ) => {
  const q = abs(p).sub(size).add( r )
	const outside = length( max( q, 0.0 ) )
	const inside = min( max( q.x, q.y ), 0.0 )

  const result = outside.add(inside).sub(r)
  return step(0, result).oneMinus()
})

MaskMaterial.colorNode = Fn(() => {
  const p = uv().sub(0.5)
  p.x.mulAssign(screenSize.x.div(screenSize.y))

  const width = remap(progress, 0, 1, 1, 0.366)
  const height = remap(progress, 0, 1, 1, 0.650)
  const scale = remap(progress, 0, 1, 1, 0.5)
  const rad = remap(progress, 0, 1, radius.mul(0.8), radius.mul(0.25))

  const colorMask = sdfRoundedRect(p, vec2(width.sub(borderWidth), height.sub(borderWidth)).mul(scale.sub(vec2())), rad)
  const borderMask = sdfRoundedRect(p, vec2(width, height).mul(scale), rad).sub(colorMask)

  return vec4(
    colorMask,
    borderMask,
    0,
    1
  )
})()
