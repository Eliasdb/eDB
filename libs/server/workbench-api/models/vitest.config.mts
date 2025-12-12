import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    reporters: ['default', 'verbose'],
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      // self import
      '@edb-workbench/api/models': path.resolve(dirname, './src/index.ts'),

      // we will want shared stuff like errors, pagination plan types, zod helpers
      '@edb-workbench/api/shared': path.resolve(
        dirname,
        '../../shared/src/index.ts',
      ),

      // we might also want infra types later (for FK ids, etc.).
      // DO NOT import infra/db client into models.
      // If you do need a type-only import from infra, you can add it here.
      // '@edb-workbench/api/infra': path.resolve(
      //   dirname,
      //   '../infra/src/index.ts'
      // ),
    },
  },
});
