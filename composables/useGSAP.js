import { gsap } from 'gsap'

export function useGSAP() {
  gsap.ticker.fps(60)

  return {
    gsap,
  }
}
