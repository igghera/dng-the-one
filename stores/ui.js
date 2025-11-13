export const useUiStore = defineStore('uiStore', {
  state: () => ({
    mainUiVisible: false,
    preloaderVisible: true,
    webglVisible: false,
    experienceStartVisible: false,
    experienceEnterNameVisible: false,
    experienceStep01Visible: false,
    experienceStep02Visible: false,
    experienceStep03Visible: false,
    experienceEndVisible: false,
    resultsVisible: false,
    qrCodeModalVisible: true,
  }),

  actions: {
    reset() {
      this.mainUiVisible = true
      this.preloaderVisible = false
      this.webglVisible = true
      this.experienceStartVisible = true
      this.experienceEnterNameVisible = false
      this.experienceStep01Visible = false
      this.experienceStep02Visible = false
      this.experienceStep03Visible = false
      this.experienceEndVisible = false
      this.resultsVisible = false
      this.qrCodeModalVisible = false
    },

    setMainUiVisible(visible) {
      this.mainUiVisible = visible
    },

    setPreloaderVisible(visible) {
      this.preloaderVisible = visible
    },

    setWebglVisible(visible) {
      this.webglVisible = visible
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
    },

    setResultsVisible(visible) {
      this.resultsVisible = visible
    },

    setQrCodeModalVisible(visible) {
      this.qrCodeModalVisible = visible
    },
  },

  getters: {
    isMainUiVisible: (state) => state.mainUiVisible,
    isPreloaderVisible: (state) => state.preloaderVisible,
    isWebglVisible: (state) => state.webglVisible,
    isExperienceStartVisible: (state) => state.experienceStartVisible,
    isExperienceEnterNameVisible: (state) => state.experienceEnterNameVisible,
    isExperienceStep01Visible: (state) => state.experienceStep01Visible,
    isExperienceStep02Visible: (state) => state.experienceStep02Visible,
    isExperienceStep03Visible: (state) => state.experienceStep03Visible,
    isExperienceEndVisible: (state) => state.experienceEndVisible,
    isResultsVisible: (state) => state.resultsVisible,
    isQrCodeModalVisible: (state) => state.qrCodeModalVisible,
  }
})
