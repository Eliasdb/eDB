import reactHooks from 'eslint-plugin-react-hooks';
import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'no-empty': ['warn', { allowEmptyCatch: true }],
      '@typescript-eslint/no-empty-function': [
        'warn',
        { allow: ['arrowFunctions', 'functions'] },
      ],
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];
