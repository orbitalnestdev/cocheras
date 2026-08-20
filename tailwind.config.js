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
        // La escala tenía sólo 500/600/700, pero el código usa brand-50, 200,
        // 300 y 400 en ~29 lugares: esas clases no se generaban y el color
        // simplemente no se aplicaba (la píldora del hero y los íconos de los
        // sellos quedaban blancos/grises en vez de azules).
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
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
