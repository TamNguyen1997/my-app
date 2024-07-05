import { nextui } from "@nextui-org/react"

module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  prefix: "",
  theme: {
    extend: {
      container: {
        center: true,
        padding: '0.5rem',
        screens: {
          DEFAULT: '1024px',
          sm: '1024px',
          md: '1024px',
          lg: '1024px',
          xl: '1024px',
          '2xl': '1024px',
        }
      },
      fontFamily: {
        open_san: ['Open Sans', 'san-serif']

      },
      backgroundImage: {
        'introduction': "url('/Anh-gui-27.png')",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), nextui()],
} 