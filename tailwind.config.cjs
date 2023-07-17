/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#F3A547',
      },
      screens: {
        '4k': '2560px',
      },
    },
  },
  plugins: [],
}
