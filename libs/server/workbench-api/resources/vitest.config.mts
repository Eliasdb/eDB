import dotenv from 'dotenv';
import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: '.env.local' });

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    reporters: ['default', 'verbose'],
    include: ['src/**/*.spec.ts'],
    pool: 'threads',
    poolOptions: {
      threads: { singleThread: true },
    },
    sequence: { concurrent: false },
  },
  resolve: {
    alias: {
      '@edb-workbench/api/resources': path.resolve(dirname, './src/index.ts'),
      '@edb-workbench/api/infra': path.resolve(
        dirname,
        '../infra/src/index.ts',
      ),
      '@edb-workbench/api/models': path.resolve(
        dirname,
        '../models/src/index.ts',
      ),
      '@edb-workbench/api/shared': path.resolve(
        dirname,
        '../shared/src/index.ts',
      ),
    },
  },
});
