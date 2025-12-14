const nx = require('@nx/eslint-plugin');

module.exports = (async () => {
  const baseConfigModule = await import('../../../../eslint.config.mjs');
  const baseConfig = baseConfigModule.default ?? baseConfigModule;

  return [
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
            prefix: 'ui',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'ui',
            style: 'kebab-case',
          },
        ],
      },
    },
    {
      files: ['**/*.html'],
      // Override or add rules here
      rules: {},
    },
    {
      files: ['**/*.ts', '**/*.html'],
      rules: {
        '@angular-eslint/prefer-inject': 'warn',
        '@angular-eslint/no-output-native': 'warn',
        '@nx/enforce-module-boundaries': 'off',
        '@angular-eslint/template/label-has-associated-control': 'off',
        '@angular-eslint/template/click-events-have-key-events': 'off',
        '@angular-eslint/template/interactive-supports-focus': 'off',
        '@angular-eslint/no-input-rename': 'off',
        '@angular-eslint/template/prefer-control-flow': 'off',
      },
    },
  ];
})();
