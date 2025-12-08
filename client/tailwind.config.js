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
          DEFAULT: '#0f172a', // Slate 900 (Rich Dark Blue/Black)
          foreground: '#f8fafc', // Slate 50
        },
        secondary: {
          DEFAULT: '#f59e0b', // Amber 500 (Gold/Orange)
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#e2e8f0', // Slate 200
          foreground: '#1e293b', // Slate 800
        },
        background: '#ffffff',
        foreground: '#020617', // Slate 950
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
