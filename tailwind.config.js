/** @type {import('tailwindcss').Config} */
const animate = require('tailwindcss-animate');

module.exports = {
  content: [
    './apps/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
    './**/*.stories.{ts,mdx}',
    './.storybook/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(100, 5%, 84%)',
        accent: 'var(--accent)',
        'accent-complimentary': 'var(--accent-complimentary)',
      },
    },
  },
  plugins: [animate],
};
