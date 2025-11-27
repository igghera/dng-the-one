import { Pane } from 'tweakpane'

import { backgroundCopper, backgroundGold } from './materials/background'

export class ExploreDebug {
  constructor() {
    this.pane = new Pane({
      title: 'Debug',
      container: document.getElementById('debug-wrapper'),
    })

    this.createBackground()
  }

  createBackground() {
    [backgroundCopper, backgroundGold].forEach(background => {
      const folder = this.pane.addFolder({
        title: background.name,
        expanded: true,
      })

      folder.addBinding(background.drawProgress, 'value', { label: 'Draw Progress', min: 0, max: 1 })
      folder.addBinding(background.drawSmooth, 'value', { label: 'Draw Smooth', min: 0, max: 1 })
    })
  }
}
