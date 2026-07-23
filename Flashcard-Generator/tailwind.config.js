/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBg: "#000000",
        brandSurface: "#1a1a1a",
        brandBorder: "#333333",
        brandAqua: "#00ffbf",
      },
      fontFamily: {
        sans: ['"Inria Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
}

