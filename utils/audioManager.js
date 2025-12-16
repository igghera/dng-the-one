import { Howl } from 'howler'

import { AUDIO_LABELS } from './constants'

import baseLoop from '~/assets/music/base.wav'
import campaignLoop from '~/assets/music/campaign.mp3'

export class AudioManager {
  #init = false
  #files = new Map()

  constructor() {}

  init() {
    if (this.#init) return
    if (import.meta.server) return

    const commonParams = {
      loop: true,
      volume: 0,
      html5: true,
    }

    this.#files.set(AUDIO_LABELS.BASE_LOOP, new Howl({ src: [baseLoop], ...commonParams }))
    this.#files.set(AUDIO_LABELS.CAMPAIGN_LOOP, new Howl({ src: [campaignLoop], ...commonParams }))

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

