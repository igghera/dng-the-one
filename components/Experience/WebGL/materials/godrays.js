import { MeshBasicNodeMaterial, DoubleSide, AdditiveBlending } from 'three/webgpu'
import {
  Fn,
  vec4,
  uniform,
  positionLocal,
  If,
  uv,
  mx_worley_noise_float,
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
export const noiseScale = uniform(5)
export const godraysColor = uniform(color(1, 1, 1))
export const timeSpeed = uniform(0.3)
export const smoothTop = uniform(0.1)
export const smoothBottom = uniform(0.1)
export const fresnelPower = uniform(1.5)

export const GodraysMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  side: DoubleSide,
  blending: AdditiveBlending,
  opacity: 0.2
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

GodraysMaterial.colorNode = Fn(() => {
  const customUV = normalLocal.mul(noiseScale).add(time.mul(timeSpeed))
  const noise = mx_worley_noise_float(customUV)

  const smooth = smoothstep(0, smoothBottom, uv().y).mul(smoothstep(0, smoothTop, uv().y.oneMinus()))

  const viewDirection = cameraPosition.sub(positionWorld).normalize()
  const invertedFresnel = dot(normalWorld, viewDirection).abs().pow(fresnelPower)

  const alpha = noise.mul(invertedFresnel).mul(smooth)

  return vec4(0, 0, 0, alpha)
})()

GodraysMaterial.emissiveNode = Fn(() => {
  return vec4(godraysColor, 1)
})()
