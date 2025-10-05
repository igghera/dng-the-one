import { Pane } from 'tweakpane'

import {
  displacementFrequency,
  displacementAmplitude,
  timeScale,
  displacementStrength,
} from './materials/floor'

export class Debug {
  constructor() {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createSea()
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
}
