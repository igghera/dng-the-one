import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

export function useGSAP() {
  gsap.registerPlugin(Observer, Draggable, InertiaPlugin, DrawSVGPlugin)

  gsap.ticker.fps(60)

  return {
    gsap,
    Observer,
    Draggable
  }
}
