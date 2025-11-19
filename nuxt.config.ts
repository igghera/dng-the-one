// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'DG - The One',
      meta: [
        { name: 'description', content: '[DESCRIPTION HERE]' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      ]
    }
  },

  css: [
    '~/assets/css/app.scss'
  ],

  postcss: {
    plugins: {
      'postcss-easing-gradients': {}
    }
  },


  compatibilityDate: '2024-01-01',

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

  runtimeConfig: {
    public: {
      isAppMode: process.env.APP_MODE === 'true',
    },
  },
})
