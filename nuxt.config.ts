// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false, // Capacitor requires SPA mode for full functionality
	nitro: {
		prerender: {
			routes: ["/"],
			crawlLinks: true,
			failOnError: false,
		},
	},
	app: {
		head: {
			title: "DG - The One",
			meta: [
				{ name: "description", content: "[DESCRIPTION HERE]" },
				{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
			],
		},
	},

	css: ["~/assets/css/app.scss"],

	postcss: {
		plugins: {
			"postcss-easing-gradients": {},
		},
	},

  dir: {
    pages: process.env.SHOW_SPLASH_PAGE === 'true' ? 'splash' : 'pages',
  },

  compatibilityDate: '2024-01-01',

	devtools: { enabled: false },

	modules: [
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt",
		"@nuxtjs/i18n",
		"@pinia/nuxt",
		"lenis/nuxt",
		'@nuxt/scripts'
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
      { code: 'it', name: 'IT / Italiano', file: 'it.json' },
      // { code: 'ar', name: 'AR / العربية', file: 'ar.json', dir: 'rtl' },
    ]
  },

	runtimeConfig: {
		public: {
			isAppMode: process.env.APP_MODE === "true",
			printEnabled: process.env.PRINT_ENABLED === "true",
			printerName: process.env.PRINTER_NAME ?? "none",
			useNativePicker: process.env.USE_NATIVE_PICKER === "true",
		},
	},

	$production: {
    scripts: {
      registry: {
        googleTagManager: {
          id: process.env.GTM_ID,
        }
      }
    }
  }
});
