/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ethiopia: {
          green: '#009B48',
          yellow: '#FFD100',
          red: '#EF212D',
          dark: '#0F172A',
          teal: '#0D9488'
        }
      }
    },
  },
  plugins: [],
}
