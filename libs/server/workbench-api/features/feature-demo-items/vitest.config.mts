import path from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vitest/config';

// directory of THIS config file
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    reporters: ['default', 'verbose'],

    // cwd when we run vitest is the feature root
    // so just point at src/**/*.spec.ts
    include: ['src/**/*.spec.ts'],
  },

  resolve: {
    alias: {
      // feature-local import path
      '@edb-workbench/api/feature-demo-items': path.resolve(
        dirname,
        './src/index.ts',
      ),
      // shared lib import path
      '@edb-workbench/api/shared': path.resolve(
        dirname,
        '../../shared/src/index.ts',
      ),
    },
  },
});
