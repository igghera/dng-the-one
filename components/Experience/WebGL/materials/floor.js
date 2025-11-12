import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uniform, Fn, positionLocal, time, vec2, vec3, texture, uv, transformNormalToView, mx_noise_float, color } from 'three/tsl'

export const FloorMaterial = new MeshBasicNodeMaterial()

export const baseReflectivity = uniform(0.5)
export const scale = uniform(5)
export const stretchX = uniform(1.1)
export const stretchY = uniform(1.8)
export const strength = uniform(0.26)
export const speed = uniform(0.017)
export const normalDerivativeStep = uniform(0.066)
export const normalBlend = uniform(1)
export const normalSmoothingRadius = uniform(0.62)
export const lightColor = uniform(color(0.87, 0.36, 0))
export const lightIntensity = uniform(0.47)

const t = time.mul(speed)
const centeredUV = uv().sub(0.5).mul(2)

export const noiseTexture = texture(null)

export const getDisplacement = Fn(() => {
  const uvR = centeredUV.add(vec2(t.mul(0.37), t))
  const texR = texture(noiseTexture, uvR)

  const uvG = centeredUV.add(vec2(t.mul(-0.67), t.mul(1.32)))
  const texG = texture(noiseTexture, uvG)

  return vec3(texR.r, texG.g, 0).mul(strength)
})

const sampleNoise = (coords) => {
  return mx_noise_float(coords.add(t).mul(vec2(stretchX, stretchY)).mul(scale), strength)
}

const sampleSmoothedNoise = (coords) => {
  const offsetX = vec2(normalSmoothingRadius, 0)
  const offsetY = vec2(0, normalSmoothingRadius)
  const offsetXNeg = vec2(normalSmoothingRadius.mul(-1), 0)
  const offsetYNeg = vec2(0, normalSmoothingRadius.mul(-1))

  const base = sampleNoise(coords)
  const xPlus = sampleNoise(coords.add(offsetX))
  const xMinus = sampleNoise(coords.add(offsetXNeg))
  const yPlus = sampleNoise(coords.add(offsetY))
  const yMinus = sampleNoise(coords.add(offsetYNeg))

  return base
    .add(xPlus)
    .add(xMinus)
    .add(yPlus)
    .add(yMinus)
    .div(5)
}

export const getNoise = Fn(() => {
  return sampleSmoothedNoise(uv().add(positionLocal.toVec2().mul(0.03)))
})

export const getDisplacedNormal = Fn(() => {
  // Calculate the gradient of the smoothed displacement function
  const eps = normalDerivativeStep

  const baseHeight = sampleSmoothedNoise(uv())

  // Sample displacement at neighboring UV coordinates
  const heightU = sampleSmoothedNoise(uv().add(vec2(eps, 0)))

  const heightV = sampleSmoothedNoise(uv().add(vec2(0, eps)))

  // Calculate partial derivatives
  const dDisplacementDU = heightU.sub(baseHeight).div(eps)
  const dDisplacementDV = heightV.sub(baseHeight).div(eps)

  // Base tangent vectors for a plane (assuming XZ plane with Y as up axis)
  const baseTangentU = vec3(1, 0, 0)
  const baseTangentV = vec3(0, 0, 1)

  // Add displacement derivatives to base tangents
  const tangentU = baseTangentU.add(vec3(0, dDisplacementDU, 0))
  const tangentV = baseTangentV.add(vec3(0, dDisplacementDV, 0))

  // Calculate normal as cross product
  const normal = tangentU.cross(tangentV).normalize()
  const flatNormal = vec3(0, 0, 1)
  const blendedNormal = normal.mix(flatNormal, normalBlend).normalize()

  return blendedNormal

  return transformNormalToView(blendedNormal)
})

FloorMaterial.positionNode = Fn(() => {
  const pos = positionLocal.toVar()

  pos.y.addAssign(getNoise())
  return pos
})()

FloorMaterial.normalNode = getDisplacedNormal()

FloorMaterial.colorNode = Fn(() => {
  return vec3(0)
})()
