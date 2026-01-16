export class Tracking {
  constructor() { }

  static globalParams = {
    event: 'select_content',
    content_type: 'button',
    content_id: 'the-one'
  }

  static init() {
    // const appStore = useAppStore()
    const { proxy } = useScriptGoogleTagManager()

    // this.globalParams.store_id = appStore.getStoreID

    const params = {
      event: "attributes_push",
      market: undefined, // “Americas” or “Emea” or “Apac” etc..
      region: undefined, // “Peru” or “Panama” or “Italia” etc..
      store: undefined, // “Convent Garden” etc..
      store_type: undefined, // “Permanent” or “Temporary” etc..
      entry_point: undefined, // “Touch screen” or “Ipad” or “QR code” etc..
      store_id: undefined, // ID of the store
      retailer: undefined, // name of the retailer
      retailer_id: undefined, // ID of the retailer
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
