module.exports = function (api) {
  api.cache(true);
  const isSB = process.env.EXPO_PUBLIC_STORYBOOK === '1';

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
            '@features': './src/lib/features',
            '@api': './src/lib/api',
            '@voice': './src/lib/voice',
            '@vm': './src/viewmodels',
          },
        },
      ],

      '@babel/plugin-transform-class-static-block',

      // ...(isSB ? ['@babel/plugin-transform-class-static-block'] : []),

      // keep reanimated last if you use it
      'react-native-reanimated/plugin',
    ],

    overrides: isSB
      ? [
          {
            test: /(node_modules[\/\\](?:@storybook|storybook)[\/\\])/,
            plugins: ['@babel/plugin-transform-class-static-block'],
          },
        ]
      : [],
  };
};
