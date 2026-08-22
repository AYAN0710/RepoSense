/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B111E', // Near-black/dark slate background
          card: '#161F30', // Slightly lighter cards
          border: '#24334C', // Subtle borders
          accent: '#6366F1', // Indigo/violet accent
          accentHover: '#4F46E5',
          textMuted: '#94A3B8', // Muted secondary text
          textLight: '#F8FAFC', // Slate-50
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
