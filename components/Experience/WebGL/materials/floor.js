import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uniform, Fn, vec3, color, positionLocal, positionWorld } from 'three/tsl'

export const FloorMaterial = new MeshBasicNodeMaterial()

export const displacementFrequency = uniform(8)
export const displacementAmplitude = uniform(0.15)

FloorMaterial.positionNode = Fn(() => {
  const y = positionWorld.x.mul(displacementFrequency).sin().mul(displacementAmplitude)
  return positionLocal.add(vec3(0, y, 0))
})()

FloorMaterial.colorNode = Fn(() => {
  return color(0, 0, 0)
})()
