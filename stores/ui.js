export const useUiStore = defineStore('uiStore', {
  state: () => ({
    experienceStartVisible: true
  }),

  actions: {
    reset() {
      this.experienceStartVisible = true
    },

    setExperienceStartVisible(visible) {
      this.experienceStartVisible = visible
    }
  },

  getters: {
    isExperienceStartVisible: (state) => state.experienceStartVisible
  }
})
