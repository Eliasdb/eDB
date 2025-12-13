import type { StorybookConfig } from '@storybook/angular';
import { createRequire } from 'node:module';
import * as path from 'path';
import { dirname, join } from 'path';
import { DefinePlugin } from 'webpack';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  addons: [
    {
      name: getAbsolutePath('@storybook/addon-styling-webpack'),
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
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/angular'),
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
      test: /component\.scss$/,
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

    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
    });

    config?.plugins?.forEach((plugin) => {
      if (
        plugin?.constructor.name === 'DefinePlugin' &&
        plugin instanceof DefinePlugin
      ) {
        (plugin as DefinePlugin).definitions['process.env.NODE_ENV'] =
          JSON.stringify('development');
      }
    });

    return config;
  },
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
