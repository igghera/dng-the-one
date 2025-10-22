import { Pane } from 'tweakpane'

import {
  displacementFrequency,
  displacementAmplitude,
  timeScale,
  displacementStrength,
} from './materials/floor'

import {
  GodraysMaterial,
  scaleBottom as godraysScaleBottom,
  scaleTop as godraysScaleTop,
  scaleHeight as godraysScaleHeight,
  noiseScale as godraysNoiseScale,
  godraysColor,
  timeSpeed as godraysTimeSpeed,
  smoothTop as godraysSmoothTop,
  smoothBottom as godraysSmoothBottom,
  fresnelPower as godraysFresnelPower
} from './materials/godrays'

import {
  progress as backgroundProgress,
} from './materials/background'

export class Debug {
  constructor(dof, godrays, background) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createBackground(background)
    this.createSea()
    this.createDof(dof)
    this.createGodrays(godrays)
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
      expanded: true,
    })

    sea.addBinding(displacementStrength, 'value', { label: 'Strength', min: 0, max: 2 })
    sea.addBinding(timeScale, 'value', { label: 'Time Scale', min: 0, max: 0.03, step: 0.001 })
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

    godraysFolder.addBinding(GodraysMaterial, 'opacity', { label: 'Opacity', min: 0.01, max: 1 })
    godraysFolder.addBinding(godraysNoiseScale, 'value', { label: 'Amount', min: 1, max: 20 })
    godraysFolder.addBinding(godraysTimeSpeed, 'value', { label: 'Speed', min: 0, max: 3 })
    godraysFolder.addBinding(godraysFresnelPower, 'value', { label: 'Fresnel Power', min: 0.1, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysColor, 'value', { label: 'Color', color: { type: 'float' } })
    godraysFolder.addBinding(godraysSmoothTop, 'value', { label: 'Smooth Top', min: 0, max: 1 })
    godraysFolder.addBinding(godraysSmoothBottom, 'value', { label: 'Smooth Bottom', min: 0, max: 1 })
  }
}
