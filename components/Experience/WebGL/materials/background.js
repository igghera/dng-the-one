import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, uv, smoothstep, uniform, mix, texture, positionWorld, length, distance } from 'three/tsl'

export const progress = uniform(0)

export class BackgroundMaterial {
  constructor(textures = []) {
    this.uniforms = new Map()

    textures.forEach((texture, idx) => {
      this.uniforms.set(`texture_${idx}`, uniform(texture))
    })

    this.material = new MeshBasicNodeMaterial({
      color: 0x000000,
      transparent: true,
      dithering: true,
      visible: true
    })

    this.material.colorNode = Fn(() => {
      const colA = texture(textures.get('bg_01_mobile'))
      const colB = texture(textures.get('bg_02_mobile'))
      const colC = texture(textures.get('bg_03_mobile'))
      const colD = texture(textures.get('bg_04_mobile'))

      const progressDegrees = progress.mul(360)

      const progressAB = smoothstep(5, 85, progressDegrees)
      const progressBC = smoothstep(95, 175, progressDegrees)
      const progressCD = smoothstep(185, 265, progressDegrees)
      const progressDA = smoothstep(275, 355, progressDegrees)

      const col = mix(colA, colB, progressAB)
      col.assign(mix(col, colC, progressBC))
      col.assign(mix(col, colD, progressCD))
      col.assign(mix(col, colA, progressDA))

      return col.toVec3()
    })()

    this.material.opacityNode = Fn(() => {
      const centerUV = uv().mul(2).sub(1)
      const distanceFromCenter = length(centerUV.x)
      distanceFromCenter.assign(smoothstep(0.05, 0.25, distanceFromCenter.oneMinus()))

      const alpha = smoothstep(0.25, 0.95, uv().y).oneMinus()
      alpha.mulAssign(distanceFromCenter)

      return alpha
    })()
  }
}
