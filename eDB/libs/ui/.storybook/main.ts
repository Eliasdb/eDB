import type { StorybookConfig } from '@storybook/angular';

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
  // webpackFinal: async (config) => {
  //   config.module = config.module || { rules: [] };
  //   config.module.rules = config.module.rules || [];

  //   // Type guard function
  //   function isRuleWithTest(rule: unknown): rule is RuleSetRule {
  //     return (
  //       typeof rule === 'object' &&
  //       rule !== null &&
  //       ('test' in rule || 'include' in rule || 'exclude' in rule)
  //     );
  //   }

  //   // Remove existing SCSS rules to avoid conflicts
  //   config.module.rules = config.module.rules.filter((rule) => {
  //     if (isRuleWithTest(rule)) {
  //       const test = rule.test;
  //       if (test && test.toString().includes('scss')) {
  //         return false; // Exclude this rule
  //       }
  //     }
  //     return true; // Keep other rules
  //   });

  //   // Add SCSS handling
  //   config.module.rules.push({
  //     test: /\.scss$/,
  //     use: [
  //       'to-string-loader', // Converts CSS to strings for Angular
  //       'css-loader',
  //       {
  //         loader: 'sass-loader',
  //         options: {
  //           implementation: require('sass'),
  //           sourceMap: true,
  //           sassOptions: {
  //             includePaths: [path.resolve(__dirname, '../node_modules')],
  //           },
  //         },
  //       },
  //     ],
  //   });

  //   return config;
  // },
};

export default config;
