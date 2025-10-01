// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'DG - The One',
      meta: [
        { name: 'description', content: '[DESCRIPTION HERE]' },
      ]
    }
  },

  css: [
    '~/assets/css/app.scss'
  ],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'lenis/nuxt'
  ],

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: false,
      redirectOn: 'no prefix',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: [
      { code: 'en', name: 'EN / English', file: 'en.json' },
      // { code: 'it', name: 'IT / Italiano', file: 'it.json' },
      // { code: 'ar', name: 'AR / العربية', file: 'ar.json', dir: 'rtl' },
    ]
  },

})
