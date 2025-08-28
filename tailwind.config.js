/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      'mobile': '328px',
      // 'tablet': '768px',
      // 'md': '768px',
      'tablet': '1164px',
      // md here just for external packages
      'md': '1164px',
      // 'laptop': '1024px',
      // 'desktop': '1280px',
    },
    fontFamily: {
      sans: 'Poppins, sans-serif',
    },
    boxShadow: {
      inner: 'inset 2px 2px 2px rgba(0, 0, 0, 0.17)',
    },
    extend: {
      colors: {
        blue: '#3956FE',
        'blue-100': '#1331E2',
        gray: 'rgba(59, 75, 102, 0.68)',
        'gray-900': '#3B4B66',
        'gray-border': 'rgba(67, 64, 84, 0.2)',
        'green-300': '#55DD83',
        shape: '#CEECFE',
        default: 'rgba(59, 75, 102, 0.68)',
      },
      minWidth: {
        200: '200px',
      },
      backgroundColor: {
        gray: 'rgba(57, 86, 254, 0.03)',
        'gray-main': '#F3F2F9',
        'gray-100': 'rgba(59, 75, 102, 0.04)',
      },
      keyframes: {
        'open-menu': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        }
      },
      animation: {
        'open-menu': 'open-menu 0.1s ease-in-out',
      },
      fontSize: {
        sm: ['12px', '16px'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

