import { MeshBasicNodeMaterial, DataTexture } from 'three/webgpu'
import { Fn, texture, uv, vec2, uniform, color, smoothstep } from 'three/tsl'

const dummyTexture = new DataTexture(
  new Uint8Array([0, 0, 0, 0]),
  1, 1
)
dummyTexture.needsUpdate = true

class BackgroundMaterial {
  name = 'Background'
  drawColor = uniform(color(0.7, 0.2, 0.06))
  drawProgress = uniform(0.5)
  drawSmooth = uniform(0.28)

  constructor() {
    this.material = new MeshBasicNodeMaterial({
      transparent: true,
    })

    // Create a reactive map object that updates the material when value changes
    const self = this

    let mapValue = dummyTexture
    this.map = {
      get value() {
        return mapValue
      },
      set value(newValue) {
        mapValue = newValue
        self.updateColorNode()
      }
    }

    let maskValue = dummyTexture
    this.mask = {
      get value() {
        return maskValue
      },
      set value(newValue) {
        maskValue = newValue
        self.updateOpacityNode()
      }
    }

    this.updateOpacityNode()
  }

  updateColorNode() {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    this.material.colorNode = Fn(() => {
      return texture(this.map.value, textureUV).toVec3()
    })()
  }

  updateOpacityNode() {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    this.material.opacityNode = Fn(() => {
      const progress = this.drawProgress.toVar()
      const maskSample = texture(this.mask.value, textureUV)
      const drawAlpha = smoothstep(
        progress,
        progress.add(this.drawSmooth),
        maskSample.r.mul(this.drawSmooth.oneMinus()).add(this.drawSmooth)
      )

      return drawAlpha.mul(maskSample.a)
    })()
  }
}

export const backgroundCopper = new BackgroundMaterial()
export const backgroundGold = new BackgroundMaterial()


