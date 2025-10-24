import { MeshBasicNodeMaterial } from 'three/webgpu'
import { uniform, Fn, positionLocal, time, vec2, vec3, texture, uv } from 'three/tsl'

export const FloorMaterial = new MeshBasicNodeMaterial()

export const displacementStrength = uniform(0.15)
export const timeScale = uniform(0.015)

const t = time.mul(timeScale)
const centeredUV = uv().sub(0.5).mul(2)

export const noiseTexture = texture(null)

export const getDisplacement = Fn(() => {
  const uvR = centeredUV.add(vec2(t.mul(0.37), t))
  const texR = texture(noiseTexture, uvR)

  const uvG = centeredUV.add(vec2(t.mul(-0.67), t.mul(1.32)))
  const texG = texture(noiseTexture, uvG)

  return vec3(texR.r, texG.g, 0).mul(displacementStrength)
})

FloorMaterial.positionNode = Fn(() => {
  return positionLocal.add(getDisplacement())
})()

FloorMaterial.normalNode = Fn(() => {
  // Calculate the gradient of the displacement function
  const eps = 0.01

  // Sample displacement at neighboring UV coordinates
  const uvU = centeredUV.add(vec2(eps, 0))
  const uvV = centeredUV.add(vec2(0, eps))

  // Calculate displacement at neighboring points
  const displacementU = Fn(() => {
    const uvR = uvU.add(vec2(t.mul(0.37), t))
    const texR = texture(noiseTexture, uvR)
    const uvG = uvU.add(vec2(t.mul(-0.67), t.mul(1.32)))
    const texG = texture(noiseTexture, uvG)
    return vec3(texR.r, texG.g, 0).mul(displacementStrength)
  })()

  const displacementV = Fn(() => {
    const uvR = uvV.add(vec2(t.mul(0.37), t))
    const texR = texture(noiseTexture, uvR)
    const uvG = uvV.add(vec2(t.mul(-0.67), t.mul(1.32)))
    const texG = texture(noiseTexture, uvG)
    return vec3(texR.r, texG.g, 0).mul(displacementStrength)
  })()

  // Calculate partial derivatives
  const dDisplacementDU = displacementU.sub(getDisplacement()).div(eps)
  const dDisplacementDV = displacementV.sub(getDisplacement()).div(eps)

  // Base tangent vectors for a plane (assuming XY plane)
  const baseTangentU = vec3(1, 0, 0)
  const baseTangentV = vec3(0, 1, 0)

  // Add displacement derivatives to base tangents
  const tangentU = baseTangentU.add(dDisplacementDU)
  const tangentV = baseTangentV.add(dDisplacementDV)

  // Calculate normal as cross product
  const normal = tangentU.cross(tangentV).normalize()

  return normal
})()

FloorMaterial.colorNode = Fn(() => {
  return vec3(0)
})()
