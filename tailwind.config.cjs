/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'main-accent': 'var(--main-color-accent)',
        'main': 'var(--main-color)',
        'main-light': 'var(--main-color-light)',
        'main-dark': 'var(--main-color-dark)',
        'blue-500': 'var(--blue-500)',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 8s infinite alternate ease-in-out',
        'progress': 'progress 1s ease forwards',
      },
      keyframes: {
        pulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.3' },
          '100%': { transform: 'scale(1.2)', opacity: '0.7' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 