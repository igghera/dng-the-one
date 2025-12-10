import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, vec2, uv, smoothstep, uniform, mix, texture, positionWorld, length } from 'three/tsl'

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
      const textureUV = vec2(uv().x, uv().y.oneMinus())

      const colA = texture(textures.get('bg_01_mobile'), textureUV)
      const colB = texture(textures.get('bg_02_mobile'), textureUV)
      const colC = texture(textures.get('bg_03_mobile'), textureUV)
      const colD = texture(textures.get('bg_04_mobile'), textureUV)

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
      const distanceFromCenter = length(centerUV)

      const alpha = smoothstep(1.4, 0.7, distanceFromCenter)
      alpha.mulAssign(smoothstep(0.65, 1, centerUV.y).oneMinus())

      return alpha
    })()
  }
}
