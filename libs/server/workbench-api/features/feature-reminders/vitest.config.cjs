// Pure CommonJS Vitest config for backend features.
// IMPORTANT: no `import` from 'vite' or 'vitest/config'.
// Vitest will still pick this up fine.

module.exports = {
  test: {
    // run tests in Node, not jsdom
    environment: 'node',

    // allow top-level describe/it/expect without imports
    globals: true,

    // where tests live
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],

    // nice to have, doesn't break anything if no coverage tooling yet
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
};
