/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0E27',
          card: '#141B3D',
          border: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}
