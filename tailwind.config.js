/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#060a17',
          dark: '#03060f',
          card: '#0a1226',
          border: '#1e3a8a',
          neon: '#00f0ff',
          neonBlue: '#3b82f6',
          gold: '#fbbf24',
          accent: '#8b5cf6',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(59, 130, 246, 0.3)',
        'neon-gold': '0 0 25px rgba(251, 191, 36, 0.6), inset 0 0 10px rgba(251, 191, 36, 0.4)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'ring-glow': '0 0 35px rgba(255, 255, 255, 0.8), 0 0 70px rgba(147, 197, 253, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}

