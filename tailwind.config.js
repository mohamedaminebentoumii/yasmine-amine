/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: '#111111',
        espresso: '#2B1D17',
        fauve: '#5A3A22',
        gold: {
          DEFAULT: '#C8A45D',
          light: '#E8D3A3',
          deep: '#A67C3B',
        },
        beige: '#E8D3A3',
        ivory: '#F8F5EE',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 24px 60px rgba(0, 0, 0, 0.45)',
        card: '0 18px 45px rgba(0, 0, 0, 0.35)',
        gold: '0 14px 34px rgba(200, 164, 93, 0.28)',
        'gold-glow': '0 0 46px rgba(200, 164, 93, 0.5), 0 14px 34px rgba(200, 164, 93, 0.3)',
      },
      borderRadius: {
        luxe: '28px',
      },
      backgroundImage: {
        'gold-cta': 'linear-gradient(135deg, #E8D3A3 0%, #C8A45D 48%, #A67C3B 100%)',
        'gold-hairline':
          'linear-gradient(90deg, transparent, rgba(200, 164, 93, 0.55), transparent)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.25' },
          '50%': { transform: 'scale(1.08)', opacity: '0.45' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.9s ease forwards',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
