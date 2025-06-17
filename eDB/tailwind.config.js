import animate from 'tailwindcss-animate';

module.exports = {
  content: ['./apps/**/*.{html,ts,scss}', './libs/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(100, 5%, 84%)', // or any other color
      },
    },
  },
  plugins: [animate],
};
