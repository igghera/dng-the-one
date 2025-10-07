import { MeshBasicNodeMaterial } from 'three/webgpu'
import { Fn, vec4, uniform, positionLocal, If, uv } from 'three/tsl'

export const scaleTop = uniform(0.5)
export const scaleBottom = uniform(1.2)
export const scaleHeight = uniform(1)

export const GodraysMaterial = new MeshBasicNodeMaterial({
  transparent: true
})

GodraysMaterial.positionNode = Fn(() => {
  const pos  = positionLocal.toVar()

  If(uv().y.lessThan(0.5), () => {
    pos.xz.mulAssign(scaleBottom)
  }).Else(() => {
    pos.xz.mulAssign(scaleTop)
  })

  pos.y.mulAssign(scaleHeight)

  return pos
})()

GodraysMaterial.colorNode = Fn(() => {
  return vec4(1, 0, 1, 0.6)
})()
