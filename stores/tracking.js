const funnelMap = new Map()
funnelMap.set('0', 'start')
funnelMap.set('1', 'enter-your-name-to-start-the-experience')
funnelMap.set('2', 'how-would-you-describe-your-aura?')
funnelMap.set('3', 'when-you-step-into-the-room')
funnelMap.set('4', 'what-vibe-do-you-want-to-radiate?')
funnelMap.set('5', 'result-press-and-hold')
funnelMap.set('5-result', 'result')
funnelMap.set('6', 'explore-the-collection')

export const useTrackingStore = defineStore('trackingStore', {
  state: () => ({
    funnelStep: '0',
    funnelName: funnelMap.get('0'),
  }),

  actions: {
    reset() {
      this.funnelStep = '0'
      this.funnelName = funnelMap.get('0')
    },


    setFunnel(step) {
      this.funnelStep = String(step)
      this.funnelName = funnelMap.get(this.funnelStep)
    },
  },

  getters: {
    getFunnelStep: state => state.funnelStep,
    getFunnelName: state => state.funnelName,
  },
})
