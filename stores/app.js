export const useAppStore = defineStore('appStore', {
  state: () => ({
    audioEnabled: false,
    username: '',

    step01Selection: null
  }),

  actions: {
    reset() {
      this.username = ''

      this.step01Selection = null
    },

    setAudioEnabled(enabled) {
      this.audioEnabled = enabled
    },

    setUsername(username) {
      this.username = username
    },

    setStep01Selection(selection) {
      this.step01Selection = selection
    }
  },

  getters: {
    isAudioEnabled: (state) => state.audioEnabled,
    getUsername: (state) => state.username,
    getStep01Selection: (state) => state.step01Selection
  }
})
