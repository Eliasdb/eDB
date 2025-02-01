// libs/utils/vitest.config.mts
import angular from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@analogjs+vite-plugin-angular@1.10.3_xelqsdxr42nziatdpqsdcssroy/node_modules/@analogjs/vite-plugin-angular/src/index.js";
import { nxCopyAssetsPlugin } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@nx+vite@20.2.2_@babel+traverse@7.26.4_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers_lyhxtj345kzenspbl2kgbjr6iu/node_modules/@nx/vite/plugins/nx-copy-assets.plugin.js";
import { nxViteTsPaths } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@nx+vite@20.2.2_@babel+traverse@7.26.4_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers_lyhxtj345kzenspbl2kgbjr6iu/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import { defineConfig } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.2_less@4.2.1_sass@1.83.0_stylus@0.64.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/libs/utils";
var vitest_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: "../node_modules/.vite/test",
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    watch: false,
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    setupFiles: ["src/test-setup.ts"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../coverage/test",
      provider: "v8"
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibGlicy91dGlscy92aXRlc3QuY29uZmlnLm10cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9lbGlhcy9EZXNrdG9wL1Byb2plY3RzL1BvcnRmb2xpbzIwMjQvRnVsbHN0YWNrL2VEQi9lREIvbGlicy91dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2VsaWFzL0Rlc2t0b3AvUHJvamVjdHMvUG9ydGZvbGlvMjAyNC9GdWxsc3RhY2svZURCL2VEQi9saWJzL3V0aWxzL3ZpdGVzdC5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lbGlhcy9EZXNrdG9wL1Byb2plY3RzL1BvcnRmb2xpbzIwMjQvRnVsbHN0YWNrL2VEQi9lREIvbGlicy91dGlscy92aXRlc3QuY29uZmlnLm10c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPSd2aXRlc3QnIC8+XG5pbXBvcnQgYW5ndWxhciBmcm9tICdAYW5hbG9nanMvdml0ZS1wbHVnaW4tYW5ndWxhcic7XG5pbXBvcnQgeyBueENvcHlBc3NldHNQbHVnaW4gfSBmcm9tICdAbngvdml0ZS9wbHVnaW5zL254LWNvcHktYXNzZXRzLnBsdWdpbic7XG5pbXBvcnQgeyBueFZpdGVUc1BhdGhzIH0gZnJvbSAnQG54L3ZpdGUvcGx1Z2lucy9ueC10c2NvbmZpZy1wYXRocy5wbHVnaW4nO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJvb3Q6IF9fZGlybmFtZSxcbiAgY2FjaGVEaXI6ICcuLi9ub2RlX21vZHVsZXMvLnZpdGUvdGVzdCcsXG4gIHBsdWdpbnM6IFthbmd1bGFyKCksIG54Vml0ZVRzUGF0aHMoKSwgbnhDb3B5QXNzZXRzUGx1Z2luKFsnKi5tZCddKV0sXG4gIC8vIFVuY29tbWVudCB0aGlzIGlmIHlvdSBhcmUgdXNpbmcgd29ya2Vycy5cbiAgLy8gd29ya2VyOiB7XG4gIC8vICBwbHVnaW5zOiBbIG54Vml0ZVRzUGF0aHMoKSBdLFxuICAvLyB9LFxuXG4gIHRlc3Q6IHtcbiAgICB3YXRjaDogZmFsc2UsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nXSxcbiAgICBzZXR1cEZpbGVzOiBbJ3NyYy90ZXN0LXNldHVwLnRzJ10sXG4gICAgcmVwb3J0ZXJzOiBbJ2RlZmF1bHQnXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcmVwb3J0c0RpcmVjdG9yeTogJy4uL2NvdmVyYWdlL3Rlc3QnLFxuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sYUFBYTtBQUNwQixTQUFTLDBCQUEwQjtBQUNuQyxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUo3QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixVQUFVO0FBQUEsRUFDVixTQUFTLENBQUMsUUFBUSxHQUFHLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFNbEUsTUFBTTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsU0FBUyxDQUFDLHNEQUFzRDtBQUFBLElBQ2hFLFlBQVksQ0FBQyxtQkFBbUI7QUFBQSxJQUNoQyxXQUFXLENBQUMsU0FBUztBQUFBLElBQ3JCLFVBQVU7QUFBQSxNQUNSLGtCQUFrQjtBQUFBLE1BQ2xCLFVBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
