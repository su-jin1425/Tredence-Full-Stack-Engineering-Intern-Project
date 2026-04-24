import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 16px 60px rgba(15, 23, 42, 0.14)',
        glow: '0 0 0 1px rgba(14, 165, 233, 0.18), 0 22px 60px rgba(14, 165, 233, 0.14)',
      },
      colors: {
        brand: {
          50: '#f1f8ff',
          100: '#dff1ff',
          200: '#b8e3ff',
          300: '#7bcfff',
          400: '#36b5ff',
          500: '#0891d1',
          600: '#0b75aa',
          700: '#0f5f88',
          800: '#144f70',
          900: '#16425f',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(circle at top left, rgba(54, 181, 255, 0.16), transparent 34%), radial-gradient(circle at 80% 0%, rgba(16, 185, 129, 0.12), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.96))',
        'mesh-dark':
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 34%), radial-gradient(circle at 80% 0%, rgba(45, 212, 191, 0.14), transparent 26%), linear-gradient(180deg, rgba(2,6,23,0.92), rgba(2,8,23,0.98))',
      },
    },
  },
  plugins: [],
} satisfies Config;
