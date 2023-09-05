/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      'poppins': ['poppins', 'sans-serif']
    },
    extend: {
      gridTemplateRows: {
        '18': 'repeat(18, minmax(0, 1fr))',
      },
      gridRow: {
        'span-8': 'span 8 / span 8',
        'span-7': 'span 7 / span 7',
        'span-9': 'span 9 / span 9',
        'span-12': 'span 12 / span 12',
        'span-13': 'span 13 / span 13',
      }

    },
  },
  plugins: [],
}

