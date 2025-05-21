// vite.styles.config.ts
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../dist/apps/eDB-user-account/assets',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/styles.css'),
      output: {
        assetFileNames: 'app-styles.css',
      },
    },
  },
});
