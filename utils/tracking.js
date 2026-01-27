import { useOnline, get, set, useLocalStorage } from '@vueuse/core'

export class Tracking {
  constructor() {}

  static globalParams = {
    event: 'select_content',
    content_type: 'button',
    content_id: 'the-one'
  }

  static init() {
    const { proxy } = useScriptGoogleTagManager()
    const online = useOnline()
    const offlineEvents = useLocalStorage('offline-events', [])

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

    if (!!proxy.google_tag_manager) {
      get(online) && proxy.dataLayer.push(params)
      !get(online) && get(offlineEvents).push(params)
    }

    watchEffect(() => {
      if (get(online)) {
        console.warn('🌍 [TRACKING] send offline events')

        get(offlineEvents).forEach(event => {
          console.table(event)

          proxy.dataLayer.push(event)
        })

        get(offlineEvents).length > 0 && set(offlineEvents, [])

        console.log('--------------------------------')
        console.log('')
      } else {
        get(offlineEvents).push(params)
      }
    })
  }

  static sendEvent(params = {}) {
    const trackingStore = useTrackingStore()
    const online = useOnline()
    const offlineEvents = useLocalStorage('offline-events', [])

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

    if (!!proxy.google_tag_manager) {
      get(online) && proxy.dataLayer.push(paramsToSend)
      !get(online) && get(offlineEvents).push(paramsToSend)
    }
  }

  static getEntryPoint() {
    const config = useRuntimeConfig()

    let entry_point = 'web'

    config.public.isAppMode && (entry_point = 'ipad')

    return entry_point
  }
}
