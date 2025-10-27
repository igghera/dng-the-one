export const useUiStore = defineStore('uiStore', {
  state: () => ({
    preloaderVisible: true,
    experienceStartVisible: true,
    experienceEnterNameVisible: false,
    experienceStep01Visible: false,
    experienceStep02Visible: false,
    experienceStep03Visible: false,
    experienceEndVisible: false
  }),

  actions: {
    reset() {
      this.preloaderVisible = true,
      this.experienceStartVisible = true
      this.experienceEnterNameVisible = false
      this.experienceStap01Visible = false
      this.experienceStep02Visible = false
      this.experienceStep03Visible = false
      this.experienceEndVisible = false
    },

    setPreloaderVisible(visible) {
      this.preloaderVisible = visible
    },

    setExperienceStartVisible(visible) {
      this.experienceStartVisible = visible
    },

    setExperienceEnterNameVisible(visible) {
      this.experienceEnterNameVisible = visible
    },

    setExperienceStep01Visible(visible) {
      this.experienceStep01Visible = visible
    },

    setExperienceStep02Visible(visible) {
      this.experienceStep02Visible = visible
    },

    setExperienceStep03Visible(visible) {
      this.experienceStep03Visible = visible
    },

    setExperienceEndVisible(visible) {
      this.experienceEndVisible = visible
    }
  },

  getters: {
    isPreloaderVisible: (state) => state.preloaderVisible,
    isExperienceStartVisible: (state) => state.experienceStartVisible,
    isExperienceEnterNameVisible: (state) => state.experienceEnterNameVisible,
    isExperienceStep01Visible: (state) => state.experienceStep01Visible,
    isExperienceStep02Visible: (state) => state.experienceStep02Visible,
    isExperienceStep03Visible: (state) => state.experienceStep03Visible,
    isExperienceEndVisible: (state) => state.experienceEndVisible
  }
})
