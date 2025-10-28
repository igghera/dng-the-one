import { IntroBackgroundMaterial } from './intro-background'
import { FloorMaterial } from './floor'
import { BackgroundMaterial } from './background'
import { ParticlesMaterial } from './particles'
import { GodraysMaterial } from './godrays'
import { DrawMaterial } from './draw'
import { MaskMaterial } from './mask'

const experienceIntroDrawMaterial = new DrawMaterial()
const experienceEndDrawMaterial = new DrawMaterial()

export {
  IntroBackgroundMaterial,
  FloorMaterial,
  BackgroundMaterial,
  ParticlesMaterial,
  GodraysMaterial,
  experienceIntroDrawMaterial,
  experienceEndDrawMaterial,
  MaskMaterial,
}
