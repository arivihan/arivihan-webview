/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      serif: ['"Urbanist"', "sans-serif"],
      sans: ['"Urbanist"', "sans-serif"],
      mono: ['"Urbanist"', "sans-serif"],
      display: ['"Urbanist"', "sans-serif"],
      body: ['"Urbanist"', "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#26c6da"
      },
      animation: {
        'fade-in-scale': 'fadeInScale 0.2s ease-out',
      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.break-words': {
            wordBreak: 'break-all',
            hyphens: 'manual',
          },
        }
      )
    }
  ],
}

