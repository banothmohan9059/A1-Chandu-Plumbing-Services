/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          950: '#08171C',
          900: '#102C35', // Midnight Teal primary
          800: '#163C48',
          700: '#1D4E5E',
          600: '#2A6B80',
          500: '#3A8BA4',
          100: '#E1EDF1',
          50: '#F0F6F8',
        },
        copper: {
          700: '#8A5E2E',
          600: '#A97C49',
          500: '#C49A65', // Champagne Copper
          400: '#D5AF80',
          300: '#E5C49A',
          200: '#F1DCC1',
          100: '#F8EFE3',
          50: '#FAF6F0',
        },
        ivory: {
          500: '#F5F2EA', // Warm Ivory
          400: '#FAF8F4',
          300: '#FDFCFA',
        },
        charcoal: {
          900: '#1A2323',
          800: '#263333', // Charcoal text & accents
          700: '#364545',
          600: '#4A5B5B',
          500: '#647676',
        },
        softgrey: {
          300: '#D5D2C8',
          200: '#E7E5DE', // Soft Grey
          100: '#F2F1EC',
          50: '#F9F9F7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(16, 44, 53, 0.08), 0 0 1px 1px rgba(16, 44, 53, 0.04)',
        'premium-hover': '0 25px 50px -12px rgba(16, 44, 53, 0.16), 0 0 1px 1px rgba(196, 154, 101, 0.2)',
        'copper-glow': '0 10px 25px -5px rgba(196, 154, 101, 0.35)',
      }
    },
  },
  plugins: [],
}
