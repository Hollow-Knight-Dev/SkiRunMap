const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Philosopher', 'Arial', 'sans-serif']
      }
    },
    screens: {
      '2xl': { min: '1280px' },
      xl: { min: '1024px', max: '1279px' },
      lg: { min: '768px', max: '1023px' },
      md: { min: '480px', max: '767px' },
      sm: { max: '479px' }
    }
  },
  darkMode: 'class',
  plugins: [nextui()]
}
