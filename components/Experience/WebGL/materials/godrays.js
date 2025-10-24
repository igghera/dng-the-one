import { MeshBasicNodeMaterial, DoubleSide, AdditiveBlending } from 'three/webgpu'
import {
  Fn,
  uniform,
  positionLocal,
  If,
  uv,
  texture,
  normalLocal,
  color,
  time,
  smoothstep,
  cameraPosition,
  positionWorld,
  normalWorld,
  dot
} from 'three/tsl'

export const scaleTop = uniform(0.5)
export const scaleBottom = uniform(1.65)
export const scaleHeight = uniform(1)
export const noiseScale = uniform(0.6)
export const godraysColor = uniform(color(1, 1, 1))
export const opacity = uniform(0.07)
export const timeSpeed = uniform(0.07)
export const smoothTop = uniform(0.1)
export const smoothBottom = uniform(0.22)
export const fresnelPower = uniform(3)

export const noiseTexture = texture(null)

export const GodraysMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
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
  const customUV = normalLocal.xy.mul(noiseScale).add(time.mul(timeSpeed))
  const noise = texture(noiseTexture, customUV)
  const smooth = smoothstep(0, smoothBottom, uv().y).mul(smoothstep(0, smoothTop, uv().y.oneMinus()))
  const viewDirection = cameraPosition.sub(positionWorld).normalize()
  const invertedFresnel = dot(normalWorld, viewDirection).abs().pow(fresnelPower)

  return noise.g.mulAssign(invertedFresnel).mulAssign(smooth).mulAssign(opacity)
})()

GodraysMaterial.emissiveNode = Fn(() => {
  return godraysColor
})()
