import { MeshStandardNodeMaterial, MeshNormalNodeMaterial } from 'three/webgpu'
import { uniform, Fn, positionLocal, time, vec2, vec3, texture, uv, mx_noise_float, float, color } from 'three/tsl'

export const FloorMaterial = new MeshStandardNodeMaterial()

export const baseReflectivity = uniform(0.5)
export const reflectionStrength = uniform(float(4))
export const scale = uniform(5)
export const stretchX = uniform(1.1)
export const stretchY = uniform(1.8)
export const strength = uniform(0.26)
export const speed = uniform(0.017)
export const normalDerivativeStep = uniform(0.066)
export const normalBlend = uniform(1)
export const normalSmoothingRadius = uniform(0.62)
export const metalness = uniform(0.9)
export const roughness = uniform(0.1)

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
  const noise1 = mx_noise_float(coords.add(t).mul(vec2(stretchX, stretchY)).mul(scale), strength)
  const noise2 = mx_noise_float(coords.add(t.mul(0.2)).mul(vec2(stretchX, stretchY)).mul(scale), strength)

  return noise1.add(noise2)
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
  // Use the same UV coordinates as getNoise() to match the actual displacement
  const noiseUV = uv().add(positionLocal.toVec2().mul(0.03))
  const eps = normalDerivativeStep

  const baseHeight = sampleSmoothedNoise(noiseUV)

  // Sample displacement at neighboring UV coordinates
  const heightU = sampleSmoothedNoise(noiseUV.add(vec2(eps, 0)))
  const heightV = sampleSmoothedNoise(noiseUV.add(vec2(0, eps)))

  // Calculate partial derivatives in UV space
  const dDisplacementDU = heightU.sub(baseHeight).div(eps)
  const dDisplacementDV = heightV.sub(baseHeight).div(eps)

  // Convert UV derivatives to world space derivatives
  // Geometry is 20x10 units (width x depth), so:
  // U (0-1) maps to X (-10 to 10) = 20 units
  // V (0-1) maps to Z (-5 to 5) = 10 units
  const geometryWidth = 20.0
  const geometryDepth = 10.0
  const dDisplacementDX = dDisplacementDU.div(geometryWidth)
  const dDisplacementDZ = dDisplacementDV.div(geometryDepth)

  // Base tangent vectors for a plane (XZ plane with Y as up axis)
  // After rotation, the plane is in XZ plane, so:
  // Tangent U is along X axis, Tangent V is along Z axis
  const baseTangentU = vec3(1, 0, 0)
  const baseTangentV = vec3(0, 0, 1)

  // Add displacement derivatives to base tangents
  // The derivative represents how much Y changes per unit of X or Z
  // tangentU = (1, dY/dX, 0) - tangent along X axis
  // tangentV = (0, dY/dZ, 1) - tangent along Z axis
  const tangentU = baseTangentU.add(vec3(0, dDisplacementDX, 0))
  const tangentV = baseTangentV.add(vec3(0, dDisplacementDZ, 0))

  // Calculate normal as cross product: tangentU × tangentV
  // This gives: (1, dY/dX, 0) × (0, dY/dZ, 1) = (-dY/dX, -1, dY/dZ)
  // We negate to get upward-pointing normal: (dY/dX, 1, -dY/dZ)
  const normal = tangentU.cross(tangentV).negate().normalize()
  const flatNormal = vec3(0, 1, 0) // Up vector for XZ plane
  const blendedNormal = normal.mix(flatNormal, normalBlend).normalize()

  return blendedNormal
})

FloorMaterial.positionNode = Fn(() => {
  const pos = positionLocal.toVar()

  pos.y.addAssign(getNoise())
  return pos
})()

FloorMaterial.normalNode = getDisplacedNormal()

FloorMaterial.metalnessNode = metalness

FloorMaterial.roughnessNode = roughness
