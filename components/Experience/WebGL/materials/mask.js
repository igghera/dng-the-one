import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, uniform, vec2, vec4, uv, step, pow, dot, screenSize, abs, length, max, min, remap } from 'three/tsl'

export const progress = uniform(1)
export const radius = uniform(0.1)

export const MaskMaterial = new MeshBasicNodeMaterial({
  color: 0xffffff
})

const getMask = Fn(() => {
  const uv0 = uv().sub(0.5)
  uv0.x.mulAssign(screenSize.x.div(screenSize.y))

  return step(pow(radius, 2), dot(uv0, uv0)).oneMinus()
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

  return vec4(
    sdfRoundedRect(p, vec2(width, height).mul(scale), rad),
    0,
    0,
    1
  )
})()
