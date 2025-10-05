import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uniform, Fn, color, positionLocal, positionWorld, time, mx_noise_vec3 } from 'three/tsl'

export const FloorMaterial = new MeshBasicNodeMaterial()

export const displacementFrequency = uniform(8)
export const displacementAmplitude = uniform(0.15)
export const displacementStrength = uniform(0.05)
export const timeScale = uniform(1)

export const getDisplacement = Fn(() => {
  const t = time.mul(timeScale)
  const noise = mx_noise_vec3(
    positionWorld.add(t),
    displacementAmplitude
  ).mul(displacementFrequency)

  return noise.mul(displacementStrength)
})()

FloorMaterial.positionNode = Fn(() => {
  return positionLocal.add(getDisplacement)
})()

FloorMaterial.colorNode = Fn(() => {
  return color(0, 0, 0)
})()
