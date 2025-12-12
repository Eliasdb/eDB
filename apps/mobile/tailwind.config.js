// apps/mobile/tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{tsx,ts}',
    './src/**/*.{tsx,ts}',
    '../../libs/**/*.{tsx,ts}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // surfaces, text, border, muted, brand... (keep yours)
        surface: { DEFAULT: '#f6f7fb', dark: '#0b0c0f' },
        'surface-2': { DEFAULT: '#ffffff', dark: '#121419' },
        white: '#ffffff',
        text: {
          DEFAULT: '#111827',
          dim: '#667085',
          dark: '#e5e7eb',
          dimDark: '#98a2b3',
        },
        border: { DEFAULT: '#e5e7eb', dark: '#1f2937' },
        muted: { DEFAULT: '#e9ecf3', dark: '#1f2937' },
        primary: '#6C63FF',
        success: '#16a34a',
        warn: '#f59e0b',
        danger: '#ef4444',
        info: '#2563eb',

        // 👇 NEW: tokens for your “tag” pill (the blue you liked)
        tag: {
          DEFAULT: '#eef1ff', // light bg
          dark: '#1b1f3a', // dark bg (navy/indigo)
          text: '#6c6f7b', // light text
          textDark: '#d1d5db', // dark text
        },
        control: {
          DEFAULT: '#e2e8f0', // slate-200 — clearly darker than #f6f7fb
          dark: '#1f2937', // keep dark the same as muted.dark
        },
      },
      spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px' },
      borderRadius: { sm: '8px', md: '12px', lg: '14px', pill: '999px' },
      boxShadow: { card: '0 2px 10px 0 rgba(0,0,0,0.06)' },
      fontFamily: { mono: ['Menlo', ...fontFamily.mono] },
    },
  },
  plugins: [],
};
