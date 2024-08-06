/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      serif: ['"DM Sans"', "sans-serif"],
      sans: ['"DM Sans"', "sans-serif"],
      mono: ['"DM Sans"', "sans-serif"],
      display: ['"DM Sans"', "sans-serif"],
      body: ['"DM Sans"', "sans-serif"],
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

