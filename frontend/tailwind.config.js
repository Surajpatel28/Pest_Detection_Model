/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // green-600
          container: '#15803d', // green-700
          fixed: '#f0fdf4', // green-50
        },
        secondary: {
          DEFAULT: '#16a34a',
          container: '#dcfce7', // green-100
        },
        tertiary: {
          DEFAULT: '#374151', // gray-700
          container: '#111827', // gray-900
        },
        'on-secondary-container': '#166534', // green-800
        surface: {
          DEFAULT: '#f9fafb', // gray-50
          container: '#f3f4f6', // gray-100
          'container-high': '#e5e7eb', // gray-200
          'container-low': '#f9fafb', 
          'container-lowest': '#ffffff',
        },
        'on-surface': '#111827', // gray-900
        'on-surface-variant': '#4b5563', // gray-600
        outline: {
          DEFAULT: '#9ca3af', // gray-400
          variant: '#e5e7eb', // gray-200
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
 