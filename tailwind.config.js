/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Anime-inspired color palette
        primary: {
          50: '#fef7ff',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },
        secondary: {
          50: '#f0f9ff',
          500: '#06b6d4',
          600: '#0891b2',
        },
        accent: {
          pink: '#ff6b9d',
          purple: '#9d4edd',
          blue: '#4cc9f0',
        }
      },
      fontFamily: {
        'anime': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}