import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        muted: '#6b7280',
        line: '#e5e7eb',
        card: '#ffffff',
        bg: '#fafafa',
        accent: '#2563eb',
        accent2: '#fb923c',
        ok: '#16a34a',
        warn: '#dc2626',
        smoke: '#475569',
        kitten: '#ea580c',
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 6px 28px rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
}

export default config

