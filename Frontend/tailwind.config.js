/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          'base-night': '#08121C',
          'panel-ice': '#0E1E38',
          'border-ice': '#1C3A5E',
          'text-primary': '#E0F2FE',
          'text-muted': '#7BA8D4',
          'accent-warm': '#FF6B2E',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        ui: ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'data-xs': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'data-sm': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'data-base': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'data-lg': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
      },
      spacing: {
        'panel': '1.25rem', // 20px
        'panel-gap': '0.75rem', // 12px
      },
      borderWidth: {
        'hair': '0.5px',
      },
      boxShadow: {
        'panel': 'none', // no drop shadows per brief
      },
    },
  },
  plugins: [],
}