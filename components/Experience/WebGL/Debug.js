import { Pane } from 'tweakpane'

import {
  displacementFrequency,
  displacementAmplitude,
  timeScale,
  displacementStrength,
} from './materials/floor'

export class Debug {
  constructor(dof) {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createSea()
    this.createDof(dof)
  }

  createSea() {
    const sea = this.pane.addFolder({
      title: 'Sea',
      expanded: true,
    })

    sea.addBinding(displacementFrequency, 'value', { label: 'Frequency', min: 1, max: 25 })
    sea.addBinding(displacementAmplitude, 'value', { label: 'Amplitude', min: 0, max: 1 })
    sea.addBinding(displacementStrength, 'value', { label: 'Strength', min: 0, max: 0.2 })
    sea.addBinding(timeScale, 'value', { label: 'Time Scale', min: 0, max: 5 })
  }

  createDof(dof) {
    const dofFolder = this.pane.addFolder({
      title: 'Depth of Field',
      expanded: true,
    })

    dofFolder.addBinding(dof.focusDistance, 'value', { label: 'Focus Distance', min: 0, max: 10 })
    dofFolder.addBinding(dof.focalLength, 'value', { label: 'Focal Length', min: 2, max: 20 })
    dofFolder.addBinding(dof.bokehScale, 'value', { label: 'Bokeh Scale', min: 1, max: 20 })
  }
}
