/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#8b9bf7',
          500: '#7b8de9',
          600: '#5f73d4',
          700: '#4c5ab4',
          800: '#3d478f',
          900: '#313a72',
        },
        accent: {
          50: '#e6f7fb',
          100: '#d3eef6',
          200: '#a7dce9',
          300: '#7acade',
          400: '#58b7d2',
          500: '#3d9fb9',
          600: '#31819a',
          700: '#2b697e',
          800: '#265567',
          900: '#234758',
        },
        surface: '#0f1628',
        ink: '#0b1220',
      },
      boxShadow: {
        brand: '0 18px 40px -18px rgba(63, 81, 181, 0.35)',
        card: '0 12px 32px -18px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
