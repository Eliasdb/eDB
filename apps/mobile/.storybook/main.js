import path from 'path';
import webpack from 'webpack';

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: { name: '@storybook/react-webpack5', options: {} },
  typescript: { reactDocgen: false },

  webpackFinal: async (cfg) => {
    cfg.resolve = cfg.resolve || {};

    // Remove SB’s default TS/JS babel rules so only OUR rule runs.
    cfg.module.rules = (cfg.module.rules || []).filter((rule) => {
      const src = rule && rule.test && rule.test.toString();
      // drop rules that handle ts/tsx/js/jsx (we will replace them)
      return !src || !/\.(t|j)sx?\$/.test(src);
    });

    cfg.plugins = [
      ...(cfg.plugins || []),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
        global: 'window',
      }),
    ];

    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      // RN -> RNW
      'react-native$': 'react-native-web',
      'react-native/Libraries/StyleSheet/StyleSheet': require.resolve(
        'react-native-web/dist/exports/StyleSheet',
      ),
      'react-native/Libraries/Utilities/Platform': require.resolve(
        'react-native-web/dist/exports/Platform',
      ),
      'react-native/Libraries/Components/View/View': require.resolve(
        'react-native-web/dist/exports/View',
      ),
      'react-native/Libraries/Components/Text/Text': require.resolve(
        'react-native-web/dist/exports/Text',
      ),
      'react-native/Libraries/Components/Switch/Switch': require.resolve(
        'react-native-web/dist/exports/Switch',
      ),
      'react-native/Libraries/Modal/Modal': require.resolve(
        'react-native-web/dist/exports/Modal',
      ),
      'react-native/Libraries/Alert/Alert': require.resolve(
        'react-native-web/dist/exports/Alert',
      ),
      'react-native/Libraries/StyleSheet/processColor': require.resolve(
        'react-native-web/dist/exports/processColor',
      ),
      'react-native/Libraries/ReactNative/UIManager': require.resolve(
        'react-native-web/dist/exports/UIManager',
      ),

      // Neutralize deep native component codegen reference
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(
        __dirname,
        './shims/codegenNativeComponent.js',
      ),

      // Expo font shim if you need it
      'expo-font': path.resolve(__dirname, './shims/expo-font.js'),

      // Silence RN dev-only modules
      'react-native/Libraries/LogBox/LogBox': false,
      'react-native/Libraries/Core/setUpReactDevTools': false,
      'react-native/Libraries/Core/Devtools/parseErrorStack': false,
      'react-native/Libraries/Core/Devtools/parseHermesStack': false,

      // ⬇️ Route ANY interop runtime import to our tiny shim
      'react-native-css-interop': path.resolve(
        __dirname,
        './shims/css-interop-runtime.js',
      ),
      'react-native-css-interop/jsx-runtime': path.resolve(
        __dirname,
        './shims/css-interop-runtime.js',
      ),
      'react-native-css-interop/jsx-dev-runtime': path.resolve(
        __dirname,
        './shims/css-interop-runtime.js',
      ),
      'react-native-css-interop/dist': path.resolve(__dirname, './shims'),
    };

    // Our single babel-loader for everything we care about
    cfg.module.rules.push({
      test: /\.[jt]sx?$/,
      include: [
        __dirname,
        path.resolve(__dirname, '../src'),
        /node_modules\/react-native\//,
        /node_modules\/@react-native\//,
        /node_modules\/react-native-[^/]+\/?/,
        /node_modules\/react-native-safe-area-context\//,
        /node_modules\/react-native-css-interop\//,
        /node_modules\/nativewind\//,
        /node_modules\/expo\//,
        /node_modules\/expo-[^/]+\/?/,
        /node_modules\/expo-modules-core\//,
        /node_modules\/@expo\/vector-icons\//,
      ],
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            [
              require.resolve('@babel/preset-env'),
              { modules: false, targets: { esmodules: true } },
            ],
            [
              require.resolve('@babel/preset-react'),
              // force normal React runtime (NOT interop)
              {
                runtime: 'automatic',
                importSource: 'react',
                development: false,
              },
            ],
            require.resolve('@babel/preset-typescript'),
          ],
          plugins: [
            require.resolve('babel-plugin-syntax-hermes-parser'),
            [
              require.resolve('@babel/plugin-transform-flow-strip-types'),
              { allowDeclareFields: true },
            ],
          ],
        },
      },
    });

    // Nuke RN dev-only files
    cfg.module.rules.push({
      test: /(LogBox|setUpReactDevTools|ReactDevToolsSettingsManager)\.js$/,
      use: require.resolve('null-loader'),
    });

    cfg.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ];

    cfg.resolve.fallback = {
      ...(cfg.resolve.fallback || {}),
      fs: false,
      path: false,
    };

    return cfg;
  },
};

export default config;
