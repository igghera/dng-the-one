import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uv, Fn, texture, screenSize, select, float } from 'three/tsl'
import { bgTexturePortrait, bgTextureLandscape } from '~/components/Experience/WebGL/nodes/textures'

export const IntroBackgroundMaterial = new MeshBasicNodeMaterial({
  transparent: true,
})

IntroBackgroundMaterial.colorNode = Fn(() => {
  return select(screenSize.x.lessThan(screenSize.y), texture(bgTexturePortrait), texture(bgTextureLandscape))
})()

IntroBackgroundMaterial.opacityNode = Fn(() => {
  return uv().mul(2).sub(1).length().smoothstep(0.85, 1).oneMinus().remap(0, 1, 0, 0.45)
})()
