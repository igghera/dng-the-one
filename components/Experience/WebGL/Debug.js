import { Pane } from 'tweakpane'

import {
  timeScale,
  displacementStrength
} from './materials/floor'

import {
  scaleBottom as godraysScaleBottom,
  scaleTop as godraysScaleTop,
  scaleHeight as godraysScaleHeight,
  noiseScale as godraysNoiseScale,
  godraysColor,
  opacity as godraysOpacity,
  timeSpeed as godraysTimeSpeed,
  smoothTop as godraysSmoothTop,
  smoothBottom as godraysSmoothBottom,
  fresnelPower as godraysFresnelPower,
  obstructionScale as godraysObstructionScale,
} from './materials/godrays'

import {
  progress as backgroundProgress
} from './materials/background'

import {
  sizeMin as particlesSizeMin,
  sizeMax as particlesSizeMax,
  opacity as particlesOpacity,
  strength as particlesNoiseStrength,
  speed as particlesSpeed,
  particleColor as particlesColor,
} from './materials/particles'

import {
  progress as maskProgress,
  radius as maskRadius,
  borderWidth as maskBorderWidth,
  maskColorA as maskBorderColorA,
  maskColorB as maskBorderColorB,
} from './materials/mask'

import {
  threshold as bloomThreshold,
  strength as bloomStrength,
  radius as bloomRadius,
} from './nodes/bloom'

import {
  intensity as lutIntensity,
} from './nodes/lut'

export class Debug {
  constructor(dof, godrays, background, particles, endDrawMaterial, introDrawMaterial, introSceneVisibility) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createIntro(introDrawMaterial, introSceneVisibility)
    this.createBackground(background)
    this.createSea()
    // this.createDof(dof)
    this.createGodrays(godrays)
    this.createParticles(particles)
    this.createEndDrawPlane(endDrawMaterial)
    this.createMask()
    this.createBloom()
    this.createLUT()
  }

  createIntro(material, visibility) {
    const folder = this.pane.addFolder({
      title: 'Intro',
      expanded: false,
    })

    folder.addBinding(visibility, 'value', { label: 'Visibility', min: 0, max: 1 })

    // folder.addBlade({ view: 'separator' })

    // folder.addBinding(introBackgroundColorA, 'value', { label: 'Background Color A', color: { type: 'float' } })
    // folder.addBinding(introBackgroundColorB, 'value', { label: 'Background Color B', color: { type: 'float' } })

    folder.addBlade({ view: 'separator' })

    folder.addBinding(material.opacity, 'value', { label: 'Shape Opacity', min: 0, max: 1 })
    folder.addBinding(material.smooth, 'value', { label: 'Shape Gradient Smooth', min: 0, max: 1 })
    folder.addBinding(material.progress, 'value', { label: 'Shape Draw', min: 0, max: 1 })
    folder.addBinding(material.colorA, 'value', { label: 'Shape Color A', color: { type: 'float' } })
    folder.addBinding(material.colorB, 'value', { label: 'Shape Color B', color: { type: 'float' } })
  }

  createBackground(background) {
    const backgroundFolder = this.pane.addFolder({
      title: 'Background',
      expanded: false,
    })

    backgroundFolder.addBinding(background.position, 'z', { label: 'Depth', min: -10, max: -3 })
    backgroundFolder.addBinding(background.position, 'y', { label: 'Position Y', min: -5, max: 5 })

    backgroundFolder.addBlade({ view: 'separator' })

    backgroundFolder.addBinding(backgroundProgress, 'value', { label: 'Progress', min: 0, max: 1 })
  }

  createSea() {
    const sea = this.pane.addFolder({
      title: 'Sea',
      expanded: false,
    })

    sea.addBinding(displacementStrength, 'value', { label: 'Strength', min: 0, max: 2 })
    sea.addBinding(timeScale, 'value', { label: 'Speed', min: -0.1, max: 0.1, step: 0.001 })
  }

  createDof(dof) {
    const dofFolder = this.pane.addFolder({
      title: 'Depth of Field',
      expanded: false,
    })

    dofFolder.addBinding(dof.focusDistance, 'value', { label: 'Focus Distance', min: 0, max: 10 })
    dofFolder.addBinding(dof.focalLength, 'value', { label: 'Focal Length', min: 2, max: 20 })
    dofFolder.addBinding(dof.bokehScale, 'value', { label: 'Bokeh Scale', min: 1, max: 20 })
  }

  createGodrays(godrays) {
    const godraysFolder = this.pane.addFolder({
      title: 'Godrays',
      expanded: false,
    })

    godraysFolder.addBinding(godrays.position, 'x', { label: 'Position X', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'y', { label: 'Position Y', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'z', { label: 'Position Z', min: -3, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysScaleTop, 'value', { label: 'Radius Top', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleBottom, 'value', { label: 'Radius Bottom', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleHeight, 'value', { label: 'Height', min: 0.05, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysOpacity, 'value', { label: 'Opacity', min: 0, max: 1 })
    godraysFolder.addBinding(godraysObstructionScale, 'value', { label: 'Obstruction Scale', min: 0, max: 1 })
    godraysFolder.addBinding(godraysNoiseScale, 'value', { label: 'Amount', min: 0, max: 3 })
    godraysFolder.addBinding(godraysTimeSpeed, 'value', { label: 'Speed', min: 0, max: 0.5 })
    godraysFolder.addBinding(godraysFresnelPower, 'value', { label: 'Fresnel Power', min: 0.1, max: 8 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysColor, 'value', { label: 'Color', color: { type: 'float' } })
    godraysFolder.addBinding(godraysSmoothTop, 'value', { label: 'Smooth Top', min: 0, max: 1 })
    godraysFolder.addBinding(godraysSmoothBottom, 'value', { label: 'Smooth Bottom', min: 0, max: 1 })
  }

  createParticles(particles) {
    const particlesFolder = this.pane.addFolder({
      title: 'Particles',
      expanded: false,
    })

    particlesFolder.addBinding(particlesOpacity, 'value', { label: 'Opacity', min: 0, max: 1 })
    particlesFolder.addBinding(particlesColor, 'value', { label: 'Color', color: { type: 'float' } })
    particlesFolder.addBinding(particlesNoiseStrength, 'value', { label: 'Noise Strength', min: 0, max: 1 })
    particlesFolder.addBinding(particlesSpeed, 'value', { label: 'Speed', min: 0, max: 1, step: 0.01 })
    particlesFolder.addBinding(particlesSizeMin, 'value', { label: 'Size Min', min: 0, max: 0.05, step: 0.0005 })
    particlesFolder.addBinding(particlesSizeMax, 'value', { label: 'Size Max', min: 0, max: 0.1, step: 0.0005 })
  }

  createEndDrawPlane(material) {
    const endDrawPlaneFolder = this.pane.addFolder({
      title: 'End Draw Plane',
      expanded: false,
    })

    endDrawPlaneFolder.addBinding(material.progress, 'value', { label: 'Progress', min: 0, max: 1 })
    endDrawPlaneFolder.addBinding(material.smooth, 'value', { label: 'Smooth', min: 0, max: 1 })
    endDrawPlaneFolder.addBinding(material.colorA, 'value', { label: 'Color A', color: { type: 'float' } })
    endDrawPlaneFolder.addBinding(material.colorB, 'value', { label: 'Color B', color: { type: 'float' } })
  }

  createMask() {
    const maskFolder = this.pane.addFolder({
      title: 'End Mask',
      expanded: true,
    })

    maskFolder.addBinding(maskProgress, 'value', { label: 'Progress', min: 0, max: 1 })
    maskFolder.addBinding(maskRadius, 'value', { label: 'Radius', min: 0, max: 1, step: 0.01 })
    maskFolder.addBinding(maskBorderWidth, 'value', { label: 'Border Width', min: 0, max: 0.3, step: 0.001 })
    maskFolder.addBinding(maskBorderColorA, 'value', { label: 'Border Color A', color: { type: 'float' } })
    maskFolder.addBinding(maskBorderColorB, 'value', { label: 'Border Color B', color: { type: 'float' } })
  }

  createBloom() {
    const bloomFolder = this.pane.addFolder({
      title: 'Postprocess - Bloom',
      expanded: true,
    })

    bloomFolder.addBinding(bloomThreshold, 'value', { label: 'Threshold', min: 1, max: 2, step: 0.01 })
    bloomFolder.addBinding(bloomStrength, 'value', { label: 'Strength', min: 0, max: 3, step: 0.01 })
    bloomFolder.addBinding(bloomRadius, 'value', { label: 'Radius', min: 0, max: 1.5, step: 0.01 })
  }

  createLUT() {
    const lutFolder = this.pane.addFolder({
      title: 'Postprocess - LUT',
      expanded: false,
    })

    lutFolder.addBinding(lutIntensity, 'value', { label: 'Intensity', min: 0, max: 1, step: 0.01 })
  }
}
