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
      }
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

