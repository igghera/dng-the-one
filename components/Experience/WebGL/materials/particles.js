import { SpriteNodeMaterial, AdditiveBlending } from 'three/webgpu'
import { instancedBufferAttribute, Fn, mx_noise_vec3, time, remap, uniform, texture } from 'three/tsl'

export const noiseTexture = texture(null)

export const sizeMin = uniform(0.0045)
export const sizeMax = uniform(0.02)

export class ParticlesMaterial {
  constructor(map, positionsAttribute) {
    this.material = new SpriteNodeMaterial({
      depthTest: true,
      depthWrite: false,
      blending: AdditiveBlending,
      transparent: true,
      sizeAttenuation: true,
      visible: false
    })

    const originalPosition = instancedBufferAttribute(positionsAttribute)

    const getNoise = Fn(() => {
      return mx_noise_vec3(originalPosition.add(time.mul(0.1)), 2)
    })

    this.material.positionNode = Fn(() => {
      return originalPosition.add(getNoise().mul(0.2))
    })()

    this.material.scaleNode = Fn(() => {
      const value = remap(getNoise().y, -1, 1, sizeMin, sizeMax)

      return value.toVec2()
    })()

    this.material.colorNode = Fn(() => {
      return texture(map)
    })()

    this.material.opacityNode = Fn(() => {
      const noise = getNoise().remap(0, 1, 0, 1)
      return noise
    })()
  }
}
