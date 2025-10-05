import { Pane } from 'tweakpane'

import { displacementFrequency, displacementAmplitude } from './materials/floor'

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

    sea.addBinding(displacementFrequency, 'value', { label: 'Displacement Frequency', min: 1, max: 25 })
    sea.addBinding(displacementAmplitude, 'value', { label: 'Displacement Amplitude', min: 0, max: 1 })
  }
}
