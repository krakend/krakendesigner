/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KrakenD brand colors with gradient support
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Gradient colors from KrakenD website
        gradient: {
          purple: '#ab83ff',
          blue: '#4177fd',
        },
        // Dark theme colors
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0f172a',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b', 
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(96deg, #ab83ff 0%, #4177fd 75%)',
        'gradient-primary-dark': 'linear-gradient(96deg, #9333ea 0%, #3b82f6 75%)',
      }
    },
  },
  plugins: [],
}