/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        panelBorder: 'rgb(var(--color-panel-border) / <alpha-value>)',
        signal: 'rgb(var(--color-signal) / <alpha-value>)',
        positive: 'rgb(var(--color-positive) / <alpha-value>)',
        negative: 'rgb(var(--color-negative) / <alpha-value>)',
        neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
        textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        drift1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(4%, 6%) scale(1.08)' },
          '66%': { transform: 'translate(-3%, 3%) scale(0.96)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '40%': { transform: 'translate(-5%, 4%) scale(1.05)' },
          '75%': { transform: 'translate(3%, -4%) scale(0.94)' },
        },
        drift3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(4%, -5%) scale(1.1)' },
        },
      },
      animation: {
        scan1: 'scan 1.1s ease-in-out infinite',
        scan2: 'scan 1.1s ease-in-out infinite 0.15s',
        scan3: 'scan 1.1s ease-in-out infinite 0.3s',
        scan4: 'scan 1.1s ease-in-out infinite 0.45s',
        scan5: 'scan 1.1s ease-in-out infinite 0.6s',
        drift1: 'drift1 22s ease-in-out infinite',
        drift2: 'drift2 26s ease-in-out infinite',
        drift3: 'drift3 19s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
