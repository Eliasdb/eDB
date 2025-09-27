module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.tsx', '.ts', '.jsx', '.json'],
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
