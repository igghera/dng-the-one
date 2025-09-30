export const useAppStore = defineStore('appStore', {
  state: () => ({
    audioEnabled: false
  }),

  actions: {
    setAudioEnabled(enabled) {
      this.audioEnabled = enabled
    }
  },

  getters: {
    isAudioEnabled: (state) => state.audioEnabled
  }
})
