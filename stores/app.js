export const useAppStore = defineStore('appStore', {
  state: () => ({
    audioEnabled: false,
    username: '',

    step01Selection: null,
    step02Selection: null,
    step03Selection: null
  }),

  actions: {
    reset() {
      this.username = ''

      this.step01Selection = null
      this.step02Selection = null
      this.step03Selection = null
    },

    setAudioEnabled(enabled) {
      this.audioEnabled = enabled
    },

    setUsername(username) {
      this.username = username
    },

    setStep01Selection(selection) {
      this.step01Selection = selection
    },

    setStep02Selection(selection) {
      this.step02Selection = selection
    },

    setStep03Selection(selection) {
      this.step03Selection = selection
    }
  },

  getters: {
    isAudioEnabled: (state) => state.audioEnabled,
    getUsername: (state) => state.username,
    getStep01Selection: (state) => state.step01Selection,
    getStep02Selection: (state) => state.step02Selection,
    getStep03Selection: (state) => state.step03Selection
  }
})
