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
      threads: {
        singleThread: true,
      },
    },

    sequence: {
      concurrent: false,
    },
  },
  resolve: {
    alias: {
      // local exports of this lib
      '@edb-workbench/api/core': path.resolve(dirname, './src/index.ts'),

      // shared lib (two levels up from infra)
      '@edb-workbench/api/shared': path.resolve(
        dirname,
        '../../shared/src/index.ts',
      ),

      // models lib (two levels up as well)
      '@edb-workbench/api/models': path.resolve(
        dirname,
        '../../models/src/index.ts',
      ),
    },
  },
});
