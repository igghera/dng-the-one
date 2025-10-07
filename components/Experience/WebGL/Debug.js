import { Pane } from 'tweakpane'

import {
  displacementFrequency,
  displacementAmplitude,
  timeScale,
  displacementStrength,
} from './materials/floor'

import {
  scaleBottom as godraysScaleBottom,
  scaleTop as godraysScaleTop,
  scaleHeight as godraysScaleHeight,
} from './materials/godrays'

export class Debug {
  constructor(dof, godrays) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createSea()
    this.createDof(dof)
    this.createGodrays(godrays)
  }

  createSea() {
    const sea = this.pane.addFolder({
      title: 'Sea',
      expanded: false,
    })

    sea.addBinding(displacementFrequency, 'value', { label: 'Frequency', min: 1, max: 25 })
    sea.addBinding(displacementAmplitude, 'value', { label: 'Amplitude', min: 0, max: 1 })
    sea.addBinding(displacementStrength, 'value', { label: 'Strength', min: 0, max: 0.2 })
    sea.addBinding(timeScale, 'value', { label: 'Time Scale', min: 0, max: 5 })
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
      expanded: true,
    })

    godraysFolder.addBinding(godrays.position, 'x', { label: 'Position X', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'y', { label: 'Position Y', min: -3, max: 3 })
    godraysFolder.addBinding(godrays.position, 'z', { label: 'Position Z', min: -3, max: 3 })

    godraysFolder.addBlade({ view: 'separator' })

    godraysFolder.addBinding(godraysScaleTop, 'value', { label: 'Scale Top', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleBottom, 'value', { label: 'Scale Bottom', min: 0.05, max: 3 })
    godraysFolder.addBinding(godraysScaleHeight, 'value', { label: 'Scale Height', min: 0.05, max: 3 })
  }
}
