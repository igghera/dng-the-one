export const useUiStore = defineStore('uiStore', {
  state: () => ({
    experienceStartVisible: false,
    experienceEnterNameVisible: true
  }),

  actions: {
    reset() {
      this.experienceStartVisible = true
      this.experienceEnterNameVisible = false
    },

    setExperienceStartVisible(visible) {
      this.experienceStartVisible = visible
    },

    setExperienceEnterNameVisible(visible) {
      this.experienceEnterNameVisible = visible
    }
  },

  getters: {
    isExperienceStartVisible: (state) => state.experienceStartVisible,
    isExperienceEnterNameVisible: (state) => state.experienceEnterNameVisible
  }
})
