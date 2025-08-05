// vite.config.ts
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/client/edb-user-account',

  plugins: [react(), nxViteTsPaths()],

  build: {
    lib: {
      entry: path.resolve(
        __dirname,
        'src/components/webcomponent-entry/defineWebComponent.tsx',
      ),
      name: 'eDBUserAccount',
      fileName: () => 'eDB-user-account.js',
      formats: ['umd'],
    },
    outDir: '../../../dist/apps/client/edb-user-account/assets',
    emptyOutDir: true,
    cssCodeSplit: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
