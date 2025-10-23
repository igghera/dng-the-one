import { SpriteNodeMaterial, AdditiveBlending } from 'three/webgpu'
import { instancedBufferAttribute, Fn, mx_noise_vec3, time, remap, positionWorld, texture } from 'three/tsl'

export const noiseTexture = texture(null)

export class ParticlesMaterial {
  constructor(map, positionsAttribute) {
    this.material = new SpriteNodeMaterial({
      depthTest: true,
      depthWrite: false,
      blending: AdditiveBlending,
      transparent: true,
      sizeAttenuation: true,
    })

    this.material.positionNode = Fn(() => {
      const originalPosition = instancedBufferAttribute(positionsAttribute)
      const noise = mx_noise_vec3(originalPosition.add(time.mul(0.1)), 2).mul(0.1)
      return originalPosition.add(noise)
    })()

    this.material.scaleNode = Fn(() => {
      const noise = mx_noise_vec3(positionWorld.add(time.mul(0.34)), 5).mul(0.5)
      const value = remap(noise.y, -1, 1, 0.01, 0.025)

      return value.toVec2()
    })()

    this.material.colorNode = Fn(() => {
      const tex0 = texture(map)

      const noise = mx_noise_vec3(positionWorld.add(time.mul(0.34)), 5).mul(0.5)
      const alpha = remap(noise.x, -0.3, 1, 0, 1)

      tex0.mulAssign(alpha)

      return tex0
    })()
  }
}
