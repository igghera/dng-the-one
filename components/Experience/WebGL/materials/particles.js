import { SpriteNodeMaterial, AdditiveBlending } from 'three/webgpu'
import { instancedBufferAttribute, Fn, color, mx_noise_vec3, time, remap, uniform, texture, add, mul } from 'three/tsl'

export const noiseTexture = texture(null)

export const sizeMin = uniform(0.013)
export const sizeMax = uniform(0.035)
export const opacity = uniform(0)
export const strength = uniform(0.2)
export const speed = uniform(0.1)
export const particleColor = uniform(color(0.75, 0.42, 0.14))

const base = uniform(0)
const rate = uniform(0)

export class ParticlesMaterial {
  constructor(map, positionsAttribute) {
    this.material = new SpriteNodeMaterial({
      depthTest: true,
      depthWrite: false,
      blending: AdditiveBlending,
      transparent: true,
      sizeAttenuation: true
    })

    const originalPosition = instancedBufferAttribute(positionsAttribute)

    const getNoise = Fn(() => {
      return mx_noise_vec3(originalPosition.add(time.mul(speed)), 2).remap(0, 1, -1, 1)
    })

    this.material.positionNode = Fn(() => {
      return originalPosition.add(getNoise().mul(strength))
    })()

    this.material.scaleNode = Fn(() => {
      const value = remap(getNoise().y, -1, 1, sizeMin, sizeMax)

      return value.toVec2()
    })()

    this.material.colorNode = Fn(() => {
      return texture(map).mul(particleColor)
    })()

    this.material.opacityNode = Fn(() => {
      const noise = getNoise().remap(0, 1, 0, 1).mul(opacity)
      return noise
    })()
  }
}
