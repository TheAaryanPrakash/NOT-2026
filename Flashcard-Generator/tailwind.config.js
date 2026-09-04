/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBg: "#050708",
        brandSurface: "#0e1215",
        brandSurfaceHover: "#151b1f",
        brandBorder: "#1f2529",
        brandAqua: "#22e5ee",
        brandCyan: "#22e5ee",
        brandCyanDim: "#0b8f99",
        brandRed: "#f2394a",
        brandRedDim: "#7f1722",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        display: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -5px rgba(34, 229, 238, 0.25)",
        glowRed: "0 0 40px -5px rgba(242, 57, 74, 0.3)",
      },
    },
  },
  plugins: [],
}

