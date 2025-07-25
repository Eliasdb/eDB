import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {},
  },
];
