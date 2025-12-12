import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@server/workbench-api/shared': path.resolve(dirname, './src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default'],
    include: ['libs/server/workbench-api/shared/src/lib/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
