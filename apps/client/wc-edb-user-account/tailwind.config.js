const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const animate = require('tailwindcss-animate');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: [
    'border-r',
    'group-data-[side=left]:border-r',
    'group-data-[side=right]:border-l',
  ],

  theme: {
    extend: {
      colors: {
        border: 'hsl(100, 5%, 84%)', // or any other color
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      screens: {
        sm767: '767px',
      },
    },
  },
  plugins: [animate],
};
