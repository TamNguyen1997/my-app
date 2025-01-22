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
        open_san: ['Open Sans', 'san-serif'],
        roboto: ["Roboto", "sans-serif"]
      },
      animation: {
        'ping-slow': 'ping 2s linear infinite',
        'ping-delay': 'ping-delay 7s linear infinite'
      },
      backgroundImage: {
        'introduction': "url('/background.webp')",
        'contact': "url('/img-bg-contact.webp')",
      },
      keyframes: {
        'ping-delay': {
          '20%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), nextui()],
} 