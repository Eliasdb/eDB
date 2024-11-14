// .storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: { implementation: require.resolve('sass') },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {},
  webpackFinal: async (config) => {
    if (!config.module) {
      config.module = { rules: [] };
    }

    if (!config.module.rules) {
      config.module.rules = [];
    }

    if (!config.module) {
      config.module = { rules: [] };
    }

    if (!config.module.rules) {
      config.module.rules = [];
    }

    // // Add DefinePlugin to set NODE_ENV explicitly
    // config.plugins = config.plugins || [];
    // config.plugins.push(
    //   new DefinePlugin({
    //     'process.env.NODE_ENV': JSON.stringify('development'),
    //   })
    // );

    // config.module.rules = config.module.rules.filter((rule) => {
    //   if (
    //     rule &&
    //     typeof rule !== 'string' &&
    //     typeof rule !== 'function' &&
    //     typeof rule !== 'number' &&
    //     typeof rule !== 'boolean' &&
    //     !(rule instanceof RegExp) &&
    //     'test' in rule &&
    //     rule.test instanceof RegExp
    //   ) {
    //     return !rule.test.test('.scss');
    //   }
    //   return true;
    // });

    // config.module.rules.push({
    //   test: /\.scss$/,
    //   exclude: /node_modules/,
    //   use: [
    //     { loader: 'to-string-loader' },
    //     {
    //       loader: 'css-loader',
    //       options: {
    //         esModule: false,
    //       },
    //     },
    //     { loader: 'sass-loader' },
    //   ],
    //   include: path.resolve(__dirname, '../'),
    // });

    return config;
  },
};

export default config;
