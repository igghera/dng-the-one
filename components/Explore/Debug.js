import { Pane } from 'tweakpane'
import { backgroundCopper, backgroundGold } from './materials/background'
import { threshold as bloomThreshold, strength as bloomStrength, radius as bloomRadius } from './nodes/bloom'

export class ExploreDebug {
  constructor() {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createPostprocessing()
    this.createBackground()
  }

  createPostprocessing() {
    const folder = this.pane.addFolder({
      title: 'Postprocessing',
      expanded: true,
    })

    folder.addBinding(bloomThreshold, 'value', { label: 'Threshold', min: 0, max: 1, step: 0.01 })
    folder.addBinding(bloomStrength, 'value', { label: 'Strength', min: 0, max: 3, step: 0.01 })
    folder.addBinding(bloomRadius, 'value', { label: 'Radius', min: 0, max: 1.5, step: 0.01 })
  }

  createBackground() {
    [backgroundCopper, backgroundGold].forEach(background => {
      const folder = this.pane.addFolder({
        title: background.name,
        expanded: true,
      })

      folder.addBinding(background.drawProgress, 'value', { label: 'Draw Progress', min: 0, max: 1 })
      folder.addBinding(background.drawSmooth, 'value', { label: 'Draw Smooth', min: 0, max: 1 })
      folder.addBinding(background.drawColor, 'value', { label: 'Draw Color', color: { type: 'float' } })

      folder.addBlade({ view: 'separator' })

      folder.addBinding(background.mapVisibility, 'value', { label: 'Map Visibility', min: 0, max: 1 })
      folder.addBinding(background.thickness, 'value', { label: 'Thickness', min: 0, max: 1 })
    })
  }
}
