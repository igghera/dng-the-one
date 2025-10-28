import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uv, Fn, texture, color, uniform } from 'three/tsl'
import { bgTexture } from '~/components/Experience/WebGL/nodes'

export const IntroBackgroundMaterial = new MeshBasicNodeMaterial({
  transparent: true,
})

IntroBackgroundMaterial.colorNode = Fn(() => {
  return texture(bgTexture)
})()

IntroBackgroundMaterial.opacityNode = Fn(() => {
  return uv().mul(2).sub(1).length().smoothstep(0.75, 1).oneMinus().remap(0, 1, 0, 0.5)
})()
