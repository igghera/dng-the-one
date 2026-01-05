import { MeshBasicNodeMaterial, DoubleSide, AdditiveBlending, NormalBlending } from 'three/webgpu'
import {
  Fn,
  uniform,
  positionLocal,
  If,
  uv,
  texture,
  normalLocal,
  color,
  smoothstep,
  cameraPosition,
  positionWorld,
  normalWorld,
  dot
} from 'three/tsl'
import { noiseTexture } from '../nodes'

export const colorA = [0.73, 0.27, 0.02]
export const colorB = [0.949, 0.906, 0.718]

export const scaleTop = uniform(0.4)
export const scaleBottom = uniform(0.4)
export const scaleHeight = uniform(1)
export const noiseScale = uniform(0.6)
export const obstructionScale = uniform(1)
export const godraysColor = uniform(color(colorA[0], colorA[1], colorA[2]))
export const opacity = uniform(0)
export const timeSpeed = uniform(0)
export const smoothTop = uniform(0.1)
export const smoothBottom = uniform(1)
export const fresnelPower = uniform(3)
export const offset = uniform(0)

export const GodraysMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: DoubleSide,
  blending: NormalBlending,
  color: 0x000000,
  depthWrite: false,
  visible: true
})

GodraysMaterial.positionNode = Fn(() => {
  const pos  = positionLocal.toVar()

  If(uv().y.lessThan(0.5), () => {
    pos.xz.mulAssign(scaleBottom)
  }).Else(() => {
    pos.xz.mulAssign(scaleTop)
  })

  pos.y.mulAssign(scaleHeight)

  return pos
})()

GodraysMaterial.opacityNode = Fn(() => {
  const customUV = normalLocal.xy.mul(noiseScale).add(offset)
  const noise = texture(noiseTexture, customUV)
  const smooth = smoothstep(0, smoothBottom, uv().y).mul(smoothstep(0, smoothTop, uv().y.oneMinus()))
  const viewDirection = cameraPosition.sub(positionWorld).normalize()
  const invertedFresnel = dot(normalWorld, viewDirection).abs().pow(fresnelPower)

  return noise.g.add(obstructionScale).clamp(0, 1).mulAssign(invertedFresnel).mulAssign(smooth).mulAssign(opacity)
})()

GodraysMaterial.emissiveNode = Fn(() => {
  return godraysColor
})()
