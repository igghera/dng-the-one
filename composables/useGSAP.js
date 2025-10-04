import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

export function useGSAP() {
  gsap.registerPlugin(Observer)

  gsap.ticker.fps(60)

  return {
    gsap,
    Observer,
  }
}
