import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, uv, smoothstep, uniform, vec4, texture } from 'three/tsl'

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
      const alpha = smoothstep(0.25, 0.95, uv().y).oneMinus()
      const col = texture(textures.get('bg_C'))
      return vec4(col.toVec3(), alpha)
    })()
  }
}
