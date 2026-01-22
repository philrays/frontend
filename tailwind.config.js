/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#4a4a4a',
          200: '#3a3a3a',
          300: '#2a2a2a',
          400: '#1a1a1a',
          500: '#0a0a0a',
        },
        gray: {
          150: '#f8fafc',
          250: '#e2e8f0',
          350: '#cbd5e1',
          450: '#94a3b8',
          550: '#64748b',
          650: '#475569',
          750: '#334155',
          850: '#1e293b',
          950: '#0f172a',
        }
      },
      fontSize: {
        'xs': ['0.48515625rem', { lineHeight: '0.646875rem' }],
        'sm': ['0.56601562rem', { lineHeight: '0.80859375rem' }],
        'base': ['0.64687500rem', { lineHeight: '0.970312rem' }],
        'lg': ['0.72773437rem', { lineHeight: '1.13203125rem' }],
        'xl': ['0.80859375rem', { lineHeight: '1.13203125rem' }],
        '2xl': ['0.970312rem', { lineHeight: '1.294rem' }],
        '3xl': ['1.21289062rem', { lineHeight: '1.45546875rem' }],
        '4xl': ['1.45546875rem', { lineHeight: '1.61718750rem' }],
        '5xl': ['1.940625rem', { lineHeight: '1' }],
        '6xl': ['2.425781rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in',
        'bounce-slow': 'bounceSlow 2.5s infinite',
        'pulse-slow': 'pulseSlow 2.5s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
