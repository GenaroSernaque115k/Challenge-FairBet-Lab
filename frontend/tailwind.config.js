/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9e7',
          100: '#fcf0cf',
          200: '#f9e49f',
          300: '#f6d66f',
          400: '#e8c547',
          500: '#d4af37',
          600: '#c6a44b',
          700: '#a6862f',
          800: '#8b6f23',
          900: '#725a1b',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}
