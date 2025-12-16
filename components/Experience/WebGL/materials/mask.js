import { MeshBasicNodeMaterial } from 'three/webgpu'
import { If, Fn, uniform, vec2, vec4, uv, smoothstep, screenSize, abs, length, max, min, remap, color, float, div } from 'three/tsl'

export const progress = uniform(0)
export const radius = uniform(0.28)
export const borderWidth = uniform(0)
export const borderSmooth = uniform(0.004)
export const maskColorA = uniform(color(2, 0.79, 0.11))
export const maskColorB = uniform(color(0, 0, 0))

export const MaskMaterial = new MeshBasicNodeMaterial()

const sdfRoundedRect = Fn(( [p, size, r] ) => {
  const q = abs(p).sub(size).add( r )
	const outside = length( max( q, 0.0 ) )
	const inside = min( max( q.x, q.y ), 0.0 )

  const result = outside.add(inside).sub(r)
  return smoothstep(borderSmooth.negate(), borderSmooth, result).oneMinus()
})

MaskMaterial.colorNode = Fn(() => {
  const p = uv().mul(2).sub(1)
  p.x.mulAssign(screenSize.x.div(screenSize.y))

  const ratio = div(screenSize.x, screenSize.y)

  const w = float(1)
  const h = float(1)

  If(ratio.greaterThan(1), () => {
    w.assign(ratio)
    h.assign(ratio)
  })

  const width = remap(progress, 0, 1, w, float(0.366).mul(2))
  const height = remap(progress, 0, 1, h, float(0.650).mul(2))

  const scale = remap(progress, 0, 1, 1, 0.5)
  const rad = remap(progress, 0, 1, 0, radius.mul(0.25))

  const colorMask = sdfRoundedRect(p, vec2(width, height).mul(scale), rad)

  const borderMaskInner = sdfRoundedRect(p, vec2(width, height).sub(borderWidth).mul(scale), rad)
  const borderMaskOuter = sdfRoundedRect(p, vec2(width, height).mul(scale), rad)
  const borderMask = borderMaskOuter.sub(borderMaskInner)

  return vec4(
    colorMask,
    borderMask,
    0,
    1
  )
})()
