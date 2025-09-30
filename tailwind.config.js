/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        gold: '#FFDBA5'
      },

      fontFamily: {
        'body': ['"Futura LT Pro"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
      },

      screens: {
        'can-hover': { 'raw': '(hover: hover) and (pointer: fine)' },
        portrait: { 'raw': '(orientation: portrait)' },
        landscape: { 'raw': '(orientation: landscape)' },
        'sm-down': { 'max': '639px' },
        'md-down': { 'max': '767px' },
        'lg-down': { 'max': '1023px' },
        'xl-down': { 'max': '1279px' },
      },

    },
  },
  plugins: [],
}

