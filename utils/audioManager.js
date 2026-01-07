import { Howl } from 'howler'

import { AUDIO_LABELS } from './constants'

import baseLoop from '~/assets/music/base.mp3'
import campaignLoop from '~/assets/music/campaign.mp3'
import sfxTransition from '~/assets/music/transition.mp3'
import sfxClick from '~/assets/music/click.mp3'
import sfxEndShape from '~/assets/music/end_shape_transition.mp3'
import sfxStep01AnimateIn from '~/assets/music/step_01_animate_in.mp3'
import sfxStep02AnimateIn from '~/assets/music/step_02_animate_in.mp3'
import sfxStep03AnimateIn from '~/assets/music/step_03_animate_in.mp3'

export const COMMON_PARAMS = {
  loop: true,
  volume: 0,
  html5: true,
}

export class AudioManager {
  #init = false
  #files = new Map()

  constructor() {}

  init() {
    if (this.#init) return
    if (import.meta.server) return

    this.#files.set(AUDIO_LABELS.BASE_LOOP, new Howl({ src: [baseLoop], ...COMMON_PARAMS }))
    this.#files.set(AUDIO_LABELS.CAMPAIGN_LOOP, new Howl({ src: [campaignLoop], ...COMMON_PARAMS }))
    this.#files.set(AUDIO_LABELS.SFX_TRANSITION, new Howl({ src: [sfxTransition], html5: true, volume: 0.15 }))
    this.#files.set(AUDIO_LABELS.SFX_CLICK, new Howl({ src: [sfxClick], html5: true, volume: 0.4 }))
    this.#files.set(AUDIO_LABELS.SFX_END_SHAPE, new Howl({ src: [sfxEndShape], html5: true, volume: 0.65 }))
    this.#files.set(AUDIO_LABELS.SFX_STEP_01_ANIMATE_IN, new Howl({ src: [sfxStep01AnimateIn], html5: true, volume: 0.5 }))
    this.#files.set(AUDIO_LABELS.SFX_STEP_02_ANIMATE_IN, new Howl({ src: [sfxStep02AnimateIn], html5: true, volume: 0.5 }))
    this.#files.set(AUDIO_LABELS.SFX_STEP_03_ANIMATE_IN, new Howl({ src: [sfxStep03AnimateIn], html5: true, volume: 0.5 }))

    this.#files.forEach(track => {
      track.on('fade', () => {
        (track.volume() === 0) && track.stop()
      })
    })

    this.#init = true
  }

  play(trackId) {
    const track = this.#files.get(trackId)
    track.play()
  }

  stop(trackId) {
    const track = this.#files.get(trackId)
    track.stop()
  }

  fadeIn(trackId) {
    const track = this.#files.get(trackId)
    track.fade(track.volume(), 0.2, 1000)
    track.play()
  }

  fadeOut(trackId) {
    const track = this.#files.get(trackId)
    track.fade(track.volume(), 0, 1000)
  }

  getTrack(trackId) {
    return this.#files.get(trackId)
  }
}

const audioManager = new AudioManager()
export default audioManager

