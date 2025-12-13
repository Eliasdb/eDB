module.exports = function (api) {
  api.cache(true);
  const isSB = process.env.EXPO_PUBLIC_STORYBOOK === '1';

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Needed to parse Storybook packages that include static class blocks even when Storybook isn't enabled
      '@babel/plugin-transform-class-static-block',
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.jsx', '.json'],
          alias: {
            '@ui': './src/lib/ui',
            '@features': './src/lib/features',
            '@data-access': './src/lib/data-access',
            '@voice': './src/lib/voice',
            '@vm': './src/viewmodels',
            // '@edb-clara/feature-admin':
            //   '../../libs/client/edb-clara/features/feature-admin/src',
            // '@edb-clara/feature-chat':
            //   '../../libs/client/edb-clara/features/feature-chat/src',
            //      '@edb-clara/feature-crm':
            //   '../../libs/client/edb-clara/features/feature-chat/src',
          },
        },
      ],

      ...(isSB ? ['@babel/plugin-transform-class-static-block'] : []),

      // keep reanimated last if you use it
      'react-native-reanimated/plugin',
    ],

    overrides: isSB
      ? [
          {
            test: /(node_modules[\\/](?:@storybook|storybook)[\\/])/,
            plugins: ['@babel/plugin-transform-class-static-block'],
          },
        ]
      : [],
  };
};
