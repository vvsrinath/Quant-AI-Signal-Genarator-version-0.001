/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0b10',
        panel: 'rgba(18, 20, 28, 0.6)',
        'neon-green': '#00ff7f',
        'neon-red': '#ff003c',
        'neon-blue': '#00f0ff',
        'neon-purple': '#b026ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, rgba(16, 18, 27, 0.9) 0%, rgba(26, 28, 38, 0.9) 100%)'
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(0, 255, 127, 0.4), 0 0 20px rgba(0, 255, 127, 0.2)',
        'neon-red': '0 0 10px rgba(255, 0, 60, 0.4), 0 0 20px rgba(255, 0, 60, 0.2)',
        'neon-blue': '0 0 10px rgba(0, 240, 255, 0.4), 0 0 20px rgba(0, 240, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
