export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.04)',
        md: '0 10px 30px rgba(0, 0, 0, 0.05)',
        lg: '0 16px 40px rgba(0, 0, 0, 0.06)',
        xl: '0 24px 60px rgba(0, 0, 0, 0.08)'
      }
    }
  },
  plugins: []
};
