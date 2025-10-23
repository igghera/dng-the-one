import { Pane } from 'tweakpane'

import {
  timeScale,
  displacementStrength,
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
  fresnelPower as godraysFresnelPower
} from './materials/godrays'

import {
  progress as backgroundProgress,
} from './materials/background'

import {
  sizeMin as particlesSizeMin,
  sizeMax as particlesSizeMax,
} from './materials/particles'

export class Debug {
  constructor(dof, godrays, background, particles, endDrawMaterial) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createBackground(background)
    this.createSea()
    this.createDof(dof)
    this.createGodrays(godrays)
    this.createParticles(particles)
    this.createEndDrawPlane(endDrawMaterial)
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

    godraysFolder.addBinding(godraysOpacity, 'value', { label: 'Opacity', min: 0.01, max: 1 })
    godraysFolder.addBinding(godraysNoiseScale, 'value', { label: 'Amount', min: 0.1, max: 3 })
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

    particlesFolder.addBinding(particlesSizeMin, 'value', { label: 'Size Min', min: 0, max: 0.05, step: 0.0005 })
    particlesFolder.addBinding(particlesSizeMax, 'value', { label: 'Size Max', min: 0, max: 0.1, step: 0.0005 })
  }

  createEndDrawPlane(material) {
    const endDrawPlaneFolder = this.pane.addFolder({
      title: 'End Draw Plane',
      expanded: true,
    })

    endDrawPlaneFolder.addBinding(material.progress, 'value', { label: 'Progress', min: 0, max: 1 })
    endDrawPlaneFolder.addBinding(material.smooth, 'value', { label: 'Smooth', min: 0, max: 1 })
    endDrawPlaneFolder.addBinding(material.colorA, 'value', { label: 'Color A', color: { type: 'float' } })
    endDrawPlaneFolder.addBinding(material.colorB, 'value', { label: 'Color B', color: { type: 'float' } })
  }
}
