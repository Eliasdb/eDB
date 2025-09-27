module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
          alias: {
            '@ui': './src/lib/ui',
            '@features': './src/app/features',
            '@api': './src/lib/api',
            '@voice': './src/lib/voice',
            '@vm': './src/viewmodels',
          },
        },
      ],
      // keep reanimated last if you use it
      'react-native-reanimated/plugin',
    ],
  };
};
