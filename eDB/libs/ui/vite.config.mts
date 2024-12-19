/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  cacheDir: '../node_modules/.vite/test',
  optimizeDeps: {
    exclude: ['flatpickr/dist/plugins/rangePlugin'],
  },
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  resolve: {
    alias: {
      // Alias 'flatpickr/dist/plugins/rangePlugin' to the mock file
      'flatpickr/dist/plugins/rangePlugin': path.resolve(
        __dirname,
        'src/mocks/rangePluginMock.ts',
      ),
      // Alias with '.js' extension
      'flatpickr/dist/plugins/rangePlugin.js': path.resolve(
        __dirname,
        'src/mocks/rangePluginMock.ts',
      ),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    server: {
      deps: {
        inline: ['carbon-components-angular'],
      },
    },
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/test',
      provider: 'v8',
    },
  },
});
