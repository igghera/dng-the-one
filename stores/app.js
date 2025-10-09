export const useAppStore = defineStore('appStore', {
  state: () => ({
    audioEnabled: false,
    username: ''
  }),

  actions: {
    reset() {
      this.username = ''
    },

    setAudioEnabled(enabled) {
      this.audioEnabled = enabled
    },

    setUsername(username) {
      this.username = username
    }
  },

  getters: {
    isAudioEnabled: (state) => state.audioEnabled,
    getUsername: (state) => state.username
  }
})
