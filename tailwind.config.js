/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070A18',
          900: '#0D1230',
          800: '#141B3D',
          700: '#1E295B',
        },
        paper: {
          50: '#F5F6F8',
          100: '#EBECEF',
          200: '#D5D8DF',
        },
        brand: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        violet: {
          500: '#A855F7',
          600: '#9333EA',
        },
        star: '#FBBF24',
        'muted-dark': '#9AA3BE',
        'muted-light': '#6B7280',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'floating': '16px',
        'banner': '24px',
      },
      boxShadow: {
        'card-soft': '0 4px 20px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 30px rgba(15, 23, 42, 0.12)',
        'glow-brand': '0 0 25px rgba(37, 99, 235, 0.35)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #2563EB 0%, #A855F7 100%)',
        'brand-gradient-hover': 'linear-gradient(90deg, #1D4ED8 0%, #9333EA 100%)',
      }
    },
  },
  plugins: [],
}
