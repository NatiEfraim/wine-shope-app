/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boutique: {
          cream: '#FAF7F2',
          parchment: '#F0EBE3',
          linen: '#E8E2D8',
          charcoal: '#1A1614',
          ink: '#2C2825',
          muted: '#8A8278',
          burgundy: '#5C2430',
          'burgundy-dark': '#3D1520',
          gold: '#C9A962',
          'gold-light': '#E8D5A3',
          'gold-muted': '#A68B4B',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        boutique: '0 25px 50px -12px rgba(26, 22, 20, 0.12)',
        'boutique-lg': '0 35px 70px -18px rgba(92, 36, 48, 0.18)',
        'gold-ring': '0 0 0 1px rgba(201, 169, 98, 0.35), 0 20px 40px -15px rgba(26, 22, 20, 0.2)',
      },
      letterSpacing: {
        luxury: '0.35em',
      },
      keyframes: {
        'hero-bg-drift': {
          '0%': { transform: 'scale(1.03) translate3d(0, 0, 0)' },
          '50%': { transform: 'scale(1.09) translate3d(0.8rem, -0.45rem, 0)' },
          '100%': { transform: 'scale(1.14) translate3d(-0.7rem, 0.55rem, 0)' },
        },
        'hero-zoom-out': {
          '0%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1.03)' },
        },
        'gold-frame-glow': {
          '0%, 100%': {
            boxShadow: '0 0 18px rgba(201, 169, 98, 0.22), inset 0 0 22px rgba(201, 169, 98, 0.12)',
          },
          '50%': {
            boxShadow: '0 0 34px rgba(232, 213, 163, 0.42), inset 0 0 34px rgba(232, 213, 163, 0.18)',
          },
        },
        'hero-light-sweep': {
          '0%': { transform: 'translateX(85%) rotate(18deg)', opacity: '0' },
          '18%': { opacity: '0.55' },
          '55%': { opacity: '0.28' },
          '100%': { transform: 'translateX(-85%) rotate(18deg)', opacity: '0' },
        },
        'hero-glow-pulse': {
          '0%, 100%': { opacity: '0.18', transform: 'scale(0.95)' },
          '50%': { opacity: '0.45', transform: 'scale(1.12)' },
        },
        'hero-from-right': {
          '0%': { opacity: '0', transform: 'translateX(2.5rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'hero-from-left': {
          '0%': { opacity: '0', transform: 'translateX(-2.5rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'hero-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(1.25rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'hero-bg-drift': 'hero-bg-drift 9s ease-in-out infinite alternate',
        'hero-zoom-out': 'hero-zoom-out 3s ease-out both',
        'gold-frame-glow': 'gold-frame-glow 3.8s ease-in-out infinite',
        'hero-light-sweep': 'hero-light-sweep 3.2s ease-in-out infinite',
        'hero-glow-pulse': 'hero-glow-pulse 4.5s ease-in-out infinite',
        'hero-from-right': 'hero-from-right 0.85s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-from-left': 'hero-from-left 0.85s cubic-bezier(0.22, 1, 0.36, 1) both',
        'hero-fade-up': 'hero-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}