// apps/eDB/vite.config.mts
import angular from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@analogjs+vite-plugin-angular@1.10.3_xelqsdxr42nziatdpqsdcssroy/node_modules/@analogjs/vite-plugin-angular/src/index.js";
import { nxCopyAssetsPlugin } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@nx+vite@20.2.2_@babel+traverse@7.26.4_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers_lyhxtj345kzenspbl2kgbjr6iu/node_modules/@nx/vite/plugins/nx-copy-assets.plugin.js";
import { nxViteTsPaths } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/@nx+vite@20.2.2_@babel+traverse@7.26.4_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers_lyhxtj345kzenspbl2kgbjr6iu/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js";
import { defineConfig } from "file:///Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.2_less@4.2.1_sass@1.83.0_stylus@0.64.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/elias/Desktop/Projects/Portfolio2024/Fullstack/eDB/eDB/apps/eDB";
var vite_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: "../node_modules/.vite/test",
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(["*.md"])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    server: {
      deps: {
        inline: ["carbon-components-angular"]
      }
    },
    watch: true,
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
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy9lREIvdml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2VsaWFzL0Rlc2t0b3AvUHJvamVjdHMvUG9ydGZvbGlvMjAyNC9GdWxsc3RhY2svZURCL2VEQi9hcHBzL2VEQlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2VsaWFzL0Rlc2t0b3AvUHJvamVjdHMvUG9ydGZvbGlvMjAyNC9GdWxsc3RhY2svZURCL2VEQi9hcHBzL2VEQi92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2VsaWFzL0Rlc2t0b3AvUHJvamVjdHMvUG9ydGZvbGlvMjAyNC9GdWxsc3RhY2svZURCL2VEQi9hcHBzL2VEQi92aXRlLmNvbmZpZy5tdHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz0ndml0ZXN0JyAvPlxuaW1wb3J0IGFuZ3VsYXIgZnJvbSAnQGFuYWxvZ2pzL3ZpdGUtcGx1Z2luLWFuZ3VsYXInO1xuaW1wb3J0IHsgbnhDb3B5QXNzZXRzUGx1Z2luIH0gZnJvbSAnQG54L3ZpdGUvcGx1Z2lucy9ueC1jb3B5LWFzc2V0cy5wbHVnaW4nO1xuaW1wb3J0IHsgbnhWaXRlVHNQYXRocyB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtdHNjb25maWctcGF0aHMucGx1Z2luJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiBfX2Rpcm5hbWUsXG4gIGNhY2hlRGlyOiAnLi4vbm9kZV9tb2R1bGVzLy52aXRlL3Rlc3QnLFxuICBwbHVnaW5zOiBbYW5ndWxhcigpLCBueFZpdGVUc1BhdGhzKCksIG54Q29weUFzc2V0c1BsdWdpbihbJyoubWQnXSldLFxuXG4gIC8vIFVuY29tbWVudCB0aGlzIGlmIHlvdSBhcmUgdXNpbmcgd29ya2Vycy5cbiAgLy8gd29ya2VyOiB7XG4gIC8vICBwbHVnaW5zOiBbIG54Vml0ZVRzUGF0aHMoKSBdLFxuICAvLyB9LFxuXG4gIHRlc3Q6IHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGRlcHM6IHtcbiAgICAgICAgaW5saW5lOiBbJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB3YXRjaDogdHJ1ZSxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3Rlc3Qsc3BlY30ue2pzLG1qcyxjanMsdHMsbXRzLGN0cyxqc3gsdHN4fSddLFxuICAgIHNldHVwRmlsZXM6IFsnc3JjL3Rlc3Qtc2V0dXAudHMnXSxcbiAgICByZXBvcnRlcnM6IFsnZGVmYXVsdCddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICByZXBvcnRzRGlyZWN0b3J5OiAnLi4vY292ZXJhZ2UvdGVzdCcsXG4gICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsMEJBQTBCO0FBQ25DLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsb0JBQW9CO0FBSjdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFVBQVU7QUFBQSxFQUNWLFNBQVMsQ0FBQyxRQUFRLEdBQUcsY0FBYyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9sRSxNQUFNO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsUUFDSixRQUFRLENBQUMsMkJBQTJCO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsc0RBQXNEO0FBQUEsSUFDaEUsWUFBWSxDQUFDLG1CQUFtQjtBQUFBLElBQ2hDLFdBQVcsQ0FBQyxTQUFTO0FBQUEsSUFDckIsVUFBVTtBQUFBLE1BQ1Isa0JBQWtCO0FBQUEsTUFDbEIsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
