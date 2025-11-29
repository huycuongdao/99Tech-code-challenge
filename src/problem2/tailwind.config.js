/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        surface: 'rgba(30, 30, 46, 0.8)',
        'surface-hover': 'rgba(40, 40, 60, 0.9)',
        success: '#10b981',
        error: '#ef4444',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
