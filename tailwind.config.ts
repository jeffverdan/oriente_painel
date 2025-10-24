import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue-dark': '#0D2A55',
        'brand-blue-med': '#1C4C9A',
        'brand-blue-light': '#2F7DFF',
        'brand-gold-dark': '#B17C2D',
        'brand-gold-light': '#D9B465',
        'brand-gray-light': '#F5F5F5',
      },
      fontFamily: {
        // Poppins para títulos
        poppins: ['var(--font-poppins)', 'sans-serif'],
        // Inter para corpo de texto
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
