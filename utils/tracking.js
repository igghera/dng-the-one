export class Tracking {
  constructor() {}

  static globalParams = {
    event: 'select_content',
    content_type: 'button',
    content_id: 'the-one'
  }

  static init() {
    const { proxy } = useScriptGoogleTagManager()

    const params = {
      event: "attributes_push",
      market: undefined, // “Americas” or “Emea” or “Apac” etc..
      region: undefined, // “Peru” or “Panama” or “Italia” etc..
      store: undefined, // “Convent Garden” etc..
      store_type: undefined, // “Permanent” or “Temporary” etc..
      entry_point: this.getEntryPoint(), // “Touch screen” or “Ipad” or “QR code” etc..
      store_id: undefined, // ID of the store
      retailer: undefined, // name of the retailer
      retailer_id: undefined, // ID of the retailer
    }

    console.warn('🌍 [TRACKING] Init')
    console.table(params)
    console.log('--------------------------------')
    console.log('')

    !!proxy.google_tag_manager && proxy.dataLayer.push(params)
  }

  static sendEvent(params = {}) {
    const trackingStore = useTrackingStore()

    const { proxy } = useScriptGoogleTagManager()

    const paramsToSend = {
      ...this.globalParams,
      ...params,
      entry_point: this.getEntryPoint(),
      funnel_step: trackingStore.getFunnelStep,
      funnel_name: trackingStore.getFunnelName,
    }

    console.warn('🌍 [TRACKING] sendEvent')
    console.table(paramsToSend)
    console.log('--------------------------------')
    console.log('')

    !!proxy.google_tag_manager && proxy.dataLayer.push(paramsToSend)
  }

  static getEntryPoint() {
    const config = useRuntimeConfig()

    let entry_point = 'web'

    config.public.isAppMode && (entry_point = 'ipad')

    return entry_point
  }
}
