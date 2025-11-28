import { MeshBasicNodeMaterial, DataTexture } from 'three/webgpu'
import { Fn, texture, uv, vec2, uniform, color, smoothstep, mix, step, remap } from 'three/tsl'

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
  mapVisibility = uniform(0)
  thickness = uniform(0.5)

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

    let drawMaskValue = dummyTexture
    this.drawMask = {
      get value() {
        return drawMaskValue
      },
      set value(newValue) {
        drawMaskValue = newValue
        self.updateOpacityNode()
      }
    }

    let beamMaskValue = dummyTexture
    this.beamMask = {
      get value() {
        return beamMaskValue
      },
      set value(newValue) {
        beamMaskValue = newValue
        self.updateOpacityNode()
      }
    }

    this.updateOpacityNode()
  }

  updateColorNode() {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    this.material.colorNode = Fn(() => {
      // const sample = texture(this.beamMask.value, textureUV).r
      // return smoothstep(0.6, 1, sample).toVec3()

      const drawColor = this.drawColor
      const map = texture(this.map.value, textureUV).toVec3()

      return mix(drawColor, map, this.mapVisibility)
    })()
  }

  updateOpacityNode() {
    const textureUV = vec2(uv().x, uv().y.oneMinus())

    this.material.opacityNode = Fn(() => {
      const progress = this.drawProgress.oneMinus()

      const drawMaskSample = texture(this.drawMask.value, textureUV)
      const beamMaskSample = texture(this.beamMask.value, textureUV)

      const drawAlpha = smoothstep(
        progress,
        progress.add(this.drawSmooth),
        drawMaskSample.r.mul(this.drawSmooth.oneMinus()).add(this.drawSmooth)
      ).mul(drawMaskSample.a)

      const beamMin = this.thickness.oneMinus()
      const beamMax = beamMin.add(0.4)
      const beamAlpha = smoothstep(beamMin, beamMax, beamMaskSample.r)

      return beamAlpha.mul(drawAlpha)
    })()
  }
}

export const backgroundCopper = new BackgroundMaterial([0.22, 0.09, 0.04])
export const backgroundGold = new BackgroundMaterial([0.81, 0.67, 0.35])


