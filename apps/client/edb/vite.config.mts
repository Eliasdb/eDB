/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Point Vite at the folder that actually contains index.html
  root: join(__dirname, 'src'),

  cacheDir: join(__dirname, '../node_modules/.vite/edb'),

  plugins: [angular({ tsconfig: './tsconfig.lib.json' }), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  server: {
    port: 4200,
    strictPort: true,
  },

  build: {
    // output relative to the project root (apps/client/edb)
    outDir: join(__dirname, 'dist-vite'),
    emptyOutDir: true,
  },

  test: {
    server: {
      deps: {
        inline: ['carbon-components-angular'],
      },
    },
    watch: true,
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
