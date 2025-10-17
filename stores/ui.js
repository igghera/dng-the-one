export const useUiStore = defineStore('uiStore', {
  state: () => ({
    experienceStartVisible: false,
    experienceEnterNameVisible: false,
    experienceStep01Visible: false,
    experienceStep02Visible: false,
    experienceStep03Visible: true
  }),

  actions: {
    reset() {
      this.experienceStartVisible = true
      this.experienceEnterNameVisible = false
      this.experienceStap01Visible = false
      this.experienceStep02Visible = false
      this.experienceStep03Visible = false
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
    }
  },

  getters: {
    isExperienceStartVisible: (state) => state.experienceStartVisible,
    isExperienceEnterNameVisible: (state) => state.experienceEnterNameVisible,
    isExperienceStep01Visible: (state) => state.experienceStep01Visible,
    isExperienceStep02Visible: (state) => state.experienceStep02Visible,
    isExperienceStep03Visible: (state) => state.experienceStep03Visible
  }
})
