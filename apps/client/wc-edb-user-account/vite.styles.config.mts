// vite.styles.config.ts
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../../dist/apps/client/edb-user-account',
    assetsDir: '.', // keep the file flat
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/styles.css'),
      output: {
        assetFileNames: 'app-styles.css',
      },
    },
  },
});
