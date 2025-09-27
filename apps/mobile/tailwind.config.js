// apps/mobile/tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{tsx,ts}',
    './src/**/*.{tsx,ts}',
    '../../libs/**/*.{tsx,ts}', // if you share UI
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class', // <- important for RN
  theme: {
    extend: {
      // 1) Your semantic colors (light + dark “companions”)
      colors: {
        // surfaces
        surface: {
          DEFAULT: '#f6f7fb', // light bg
          dark: '#0b0c0f', // dark bg
        },
        white: '#ffffff',

        // text
        text: {
          DEFAULT: '#111827', // gray-900
          dim: '#667085', // zinc-500-ish
          dark: '#e5e7eb', // gray-200 for dark
          dimDark: '#98a2b3', // zinc-400-ish
        },

        // borders / shadows
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#1f2937',
        },

        muted: {
          DEFAULT: '#e9ecf3', // was too close to surface
          dark: '#1f2937', // ~gray-800
        },

        // brand & states
        primary: '#6C63FF',
        success: '#16a34a',
        warn: '#f59e0b',
        danger: '#ef4444',
        info: '#2563eb',
      },

      // 2) Map your spacing & radius to Tailwind scales
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '14px',
        pill: '999px',
      },

      // 3) A reusable “card” shadow
      boxShadow: {
        card: '0 2px 10px 0 rgba(0,0,0,0.06)',
      },

      // (optional) monospace for MonoText on web
      fontFamily: {
        mono: ['Menlo', ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};
