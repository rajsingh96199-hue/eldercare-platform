/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal 500
          600: '#0d9488', // Teal 600 - Primary Trust Brand
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a', // Deep trust navy
          950: '#020617',
        },
        senior: {
          bg: '#fafafa',
          text: '#111827',
          highlight: '#0284c7',
          accent: '#ea580c',
        }
      },
      fontSize: {
        'senior-base': '1.125rem',
        'senior-lg': '1.25rem',
        'senior-xl': '1.5rem',
        'senior-2xl': '1.875rem',
        'senior-3xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(13, 148, 136, 0.1), 0 8px 10px -6px rgba(13, 148, 136, 0.06)',
        'senior': '0 4px 0 0 rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
