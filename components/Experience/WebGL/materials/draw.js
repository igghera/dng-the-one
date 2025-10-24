import { uniform, texture, smoothstep, Fn, mix, color, time, uv } from 'three/tsl'
import { MeshBasicMaterial } from 'three/webgpu'

export const noiseTexture = texture(null)

export class DrawMaterial {
  progress = uniform(0)
  smooth = uniform(0.05)
  colorA = uniform(color(0.57, 0.48, 0.24))
  colorB = uniform(color(0.89, 0.81, 0.12))

  constructor() {
    this.material = new MeshBasicMaterial({
      transparent: true,
    })
  }

  init(mask) {
    const map = texture(mask)

    const getNoise = Fn(() => {
      return texture(noiseTexture, uv().add(time.mul(0.04), time.mul(0.023))).g
    })

    this.material.colorNode = Fn(() => {
      const noise = getNoise().smoothstep(0.3, 0.8)
      const noisedColor = mix(this.colorA, this.colorB, noise).toVec3()
      noisedColor.assign(noisedColor.remap(0, 1, 0, 1.6))

      return mix(map, noisedColor, map.a)
    })()

    this.material.opacityNode = Fn(() => {
      const progress = this.progress.oneMinus()
      const alpha = smoothstep(progress, progress.add(this.smooth), map.r.mul(this.smooth.oneMinus()).add(this.smooth))
      return alpha.mul(getNoise())
    })()
  }
}
