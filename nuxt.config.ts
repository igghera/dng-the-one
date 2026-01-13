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
			title: 'Dolce&Gabbana The One | Find Your Aura',
			meta: [
				{ name: "description", content: 'Express your confidence and reveal your unique Aura' },
				{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
			],
			link: [
				{ rel: 'icon', type: 'image/png', href: '/favicon.png' }
			]

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
		defaultLocale: 'es',
		strategy: 'no_prefix',
		detectBrowserLanguage: {
			useCookie: false,
			redirectOn: 'no prefix',
			alwaysRedirect: false,
			fallbackLocale: 'es',
		},
		compilation: {
			strictMessage: false,
			escapeHtml: false,
		},
		bundle: {
			optimizeTranslationDirective: false
		},
		locales: [
			// { code: 'en', file: 'en.json' },
			// { code: 'it', file: 'it.json' },
			{ code: 'es', file: 'es.json' },
			// { code: 'ar', name: 'AR / العربية', file: 'ar.json', dir: 'rtl' },
		]
	},

	runtimeConfig: {
		public: {
			isAppMode: process.env.APP_MODE === "true",
			printEnabled: process.env.PRINT_ENABLED === "true",
			printerName: process.env.PRINTER_NAME ?? "none",
			useNativePicker: process.env.USE_NATIVE_PICKER === "true",
			siteUrl: process.env.SITE_URL ?? "http://localhost:3000",
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
