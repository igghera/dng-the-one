import { DataTexture } from 'three/webgpu'
import { Fn, vec2, uniform, texture, screenUV, screenSize } from 'three/tsl'

const dummyTexture = new DataTexture(
  new Uint8Array([0, 0, 0, 0]),
  1, 1
)
dummyTexture.needsUpdate = true

export const map = uniform(dummyTexture)
export const opacity = uniform(0)
export const scale = uniform(0.28)
export const offsetX = uniform(0.18)
export const offsetY = uniform(0.46)

export const layer = Fn(() => {
  const uvScreen = vec2(screenUV.x, screenUV.y.oneMinus())

  const starUV = uvScreen.mul(2).sub(1).abs()
  starUV.subAssign(vec2(offsetX, offsetY))
  starUV.x.mulAssign(screenSize.x.div(screenSize.y))
  starUV.divAssign(scale)

  const sample = texture(map.value, starUV)
  sample.mulAssign(opacity)

  return sample
})()
