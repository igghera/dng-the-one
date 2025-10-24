import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { SplitText } from 'gsap/SplitText'

export function useGSAP() {
  gsap.registerPlugin(Observer, Draggable, InertiaPlugin, DrawSVGPlugin, Flip, SplitText)

  gsap.ticker.fps(60)

  return {
    gsap,
    Observer,
    Draggable,
    Flip,
    SplitText
  }
}
