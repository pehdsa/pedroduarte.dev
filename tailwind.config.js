/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0A0A0F',
          card: '#12121A',
          border: '#1E1E2E',
          surface: '#0F0F15',
          footer: '#06060A',
        },
        blue: {
          DEFAULT: '#0062FF',
          glow: '#0062FF66',
        },
        gray: {
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
        },
        green: {
          DEFAULT: '#10B981',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        geist: ['Geist Mono', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}
