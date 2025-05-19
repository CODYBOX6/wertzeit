/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [{ pattern: /.*/ }], // on garde tout
  theme: {
    extend: {
      colors: {
        'main-gradient': 'linear-gradient(to right, #3ddc97, #60efff)',
        'main': '#3ddc97',
        'main-light': '#5ef0c1',
        'main-lighter': '#a2fff3',
        'spektr-cyan-50': '#3ddc97',
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "shine-pulse": "shine-pulse var(--shine-pulse-duration) infinite linear",
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          "100%": {
            "background-position": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [],
}
