import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uv, Fn, texture, screenSize, select, screenCoordinate, div } from 'three/tsl'
import { bgTexturePortrait, bgTextureLandscape } from '~/components/Experience/WebGL/nodes/textures'
// import { gradientNoise } from '~/components/Experience/WebGL/nodes/gradientNoise'

export const IntroBackgroundMaterial = new MeshBasicNodeMaterial({
  transparent: true,
  dithering: true
})

IntroBackgroundMaterial.colorNode = Fn(() => {
  const color = select(screenSize.x.lessThan(screenSize.y), texture(bgTexturePortrait), texture(bgTextureLandscape))
  // const noise = div(1.0, 255.0).mul(gradientNoise(screenCoordinate.xy)).sub(div(0.5, 255.0))
  return color
  return color.add(noise)
})()

IntroBackgroundMaterial.opacityNode = Fn(() => {
  return uv().mul(2).sub(1).length().smoothstep(0.85, 1).oneMinus().remap(0, 1, 0, 0.45)
})()
