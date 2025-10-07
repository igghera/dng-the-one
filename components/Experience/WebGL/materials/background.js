import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, uv, smoothstep, uniform, mix, vec4, texture } from 'three/tsl'

export const progress = uniform(0)

export class BackgroundMaterial {
  constructor(textures = []) {
    this.uniforms = new Map()

    textures.forEach((texture, idx) => {
      this.uniforms.set(`texture_${idx}`, uniform(texture))
    })

    this.material = new MeshBasicNodeMaterial({
      color: 0x0000ff,
      transparent: true,
      dithering: false
    })

    this.material.colorNode = Fn(() => {
      const colA = texture(textures.get('bg_01_mobile'))
      const colB = texture(textures.get('bg_02_mobile'))
      const colC = texture(textures.get('bg_03_mobile'))
      const colD = texture(textures.get('bg_04_mobile'))

      const progressAB = smoothstep(0.23, 0.33, progress)
      const progressBC = smoothstep(0.56, 0.66, progress)
      const progressCD = smoothstep(0.89, 1, progress)

      const alpha = smoothstep(0.25, 0.95, uv().y).oneMinus()

      const col = mix(colA, colB, progressAB)
      col.assign(mix(col, colC, progressBC))
      col.assign(mix(col, colD, progressCD))

      return vec4(col.toVec3(), alpha)
    })()
  }
}
