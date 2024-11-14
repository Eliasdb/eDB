import type { StorybookConfig } from '@storybook/angular';
import * as path from 'path';

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                },
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
  webpackFinal: async (config) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    // Modify existing SCSS rules to exclude your component styles
    config.module.rules.forEach((rule) => {
      // Type guard to ensure 'rule' is an object and not null
      if (rule && typeof rule === 'object' && 'test' in rule) {
        if (
          rule.test instanceof RegExp &&
          rule.test.toString().includes('scss')
        ) {
          rule.exclude = /component\.scss$/; // Exclude component SCSS files
        }
      }
    });

    // Add rule for your component SCSS files
    config.module.rules.push({
      test: /component\.scss$/, // Target component SCSS files
      use: [
        'to-string-loader', // Converts CSS to strings for Angular components
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sourceMap: true,
            sassOptions: {
              includePaths: [path.resolve(__dirname, '../node_modules')],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default config;
