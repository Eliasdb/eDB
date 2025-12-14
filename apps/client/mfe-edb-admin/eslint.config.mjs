// eslint.config.js or eslint.config.mjs

import nx from '@nx/eslint-plugin';
import baseConfig from '../../../eslint.config.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['app', 'platform', 'lib', 'crm', 'webshop', 'dashboard', 'shell', 'wc', 'edb'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'platform', 'lib', 'crm', 'webshop', 'dashboard', 'shell', 'wc', 'edb'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
];
