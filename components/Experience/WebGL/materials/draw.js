import { uniform, texture, smoothstep, Fn, mix, color, time, uv, vec2, select } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import { noiseTexture } from '../nodes'

export class DrawMaterial {
  progress = uniform(0)
  opacity = uniform(1)
  smooth = uniform(0.05)
  colorA = uniform(color(0.57, 0.48, 0.24))
  colorB = uniform(color(0.89, 0.81, 0.12))
  mapIndex = uniform(0)

  constructor() {
    this.material = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
    })
  }

  init(maskA, maskB = undefined) {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    const mapA = texture(maskA, textureUV)
    const mapB = maskB ? texture(maskB, textureUV) : undefined

    const map = select(this.mapIndex.equal(0), mapA, mapB)

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
      const alpha = smoothstep(
        progress,
        progress.add(this.smooth),
        map.r.mul(this.smooth.oneMinus()).add(this.smooth)
      )
      return alpha.mul(getNoise()).mul(this.opacity)
    })()
  }
}
