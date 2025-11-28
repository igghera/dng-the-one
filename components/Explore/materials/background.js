import { MeshBasicNodeMaterial, DataTexture } from 'three/webgpu'
import { Fn, texture, uv, vec2, uniform, color, smoothstep } from 'three/tsl'

const dummyTexture = new DataTexture(
  new Uint8Array([0, 0, 0, 0]),
  1, 1
)
dummyTexture.needsUpdate = true

class BackgroundMaterial {
  name = 'Background'
  drawColor = uniform(color(0, 0, 0))
  drawProgress = uniform(0)
  drawSmooth = uniform(0.28)

  constructor(drawColor) {
    this.material = new MeshBasicNodeMaterial({
      transparent: true,
    })

    this.drawColor.value.r = drawColor[0]
    this.drawColor.value.g = drawColor[1]
    this.drawColor.value.b = drawColor[2]

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
      return this.drawColor.toVec3()
      return texture(this.map.value, textureUV).toVec3()
    })()
  }

  updateOpacityNode() {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    this.material.opacityNode = Fn(() => {
      const progress = this.drawProgress.oneMinus()
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

export const backgroundCopper = new BackgroundMaterial([0.22, 0.09, 0.04])
export const backgroundGold = new BackgroundMaterial([0.89, 0.65, 0.15])


