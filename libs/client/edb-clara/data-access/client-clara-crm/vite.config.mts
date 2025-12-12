// vite.config.mts
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  test: {
    name: 'client-clara-crm',
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory:
        '../../../../../coverage/libs/client/edb-clara/data-access/client-clara-crm',
    },
  },
});
