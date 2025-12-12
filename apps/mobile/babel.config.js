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
            test: /(node_modules[\/\\](?:@storybook|storybook)[\/\\])/,
            plugins: ['@babel/plugin-transform-class-static-block'],
          },
        ]
      : [],
  };
};
