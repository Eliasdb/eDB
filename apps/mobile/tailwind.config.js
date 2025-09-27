/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // your RN source
  ],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {},
  },
  plugins: [],
};
