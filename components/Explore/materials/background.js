import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, texture, uv, vec2 } from 'three/tsl'

export function makeBackgroundMaterial(map) {
  const material = new MeshBasicNodeMaterial({
    transparent: true,
  })

  const textureUV = vec2(uv().x, uv().y.oneMinus())

  material.colorNode = Fn(() => {
    return texture(map, textureUV).toVec4()
  })()

  return material
}
