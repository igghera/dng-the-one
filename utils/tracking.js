export class Tracking {
	constructor() {}

  static globalParams = {
    market: undefined,
    region: undefined,
    store: undefined,
    store_type: undefined,
    store_id: undefined,
  }

  static init() {
    // const appStore = useAppStore()
    const { proxy } = useScriptGoogleTagManager()

    // this.globalParams.store_id = appStore.getStoreID

    const params = {
      ...this.globalParams,
      event: 'attributes_push'
    }

    console.log('Init tracking')
    console.table(params)
    console.log('--------------------------------')

    !!proxy.google_tag_manager && proxy.dataLayer.push(params)
  }

	static sendEvent(params = {}) {
    // const appStore = useAppStore()
    const trackingStore = useTrackingStore()

    const { proxy } = useScriptGoogleTagManager()

    // this.globalParams.store_id = appStore.getStoreID

    const paramsToSend = {
      ...this.globalParams,
      ...params,
      funnel_step: trackingStore.getFunnelStep,
      funnel_name: trackingStore.getFunnelName,
    }

		console.log('sendEvent')
    console.table(paramsToSend)
    console.log('--------------------------------')

    !!proxy.google_tag_manager && proxy.dataLayer.push(paramsToSend)
	}
}
