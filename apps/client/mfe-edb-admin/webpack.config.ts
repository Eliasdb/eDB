// apps/eDB/webpack.config.ts
import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins } from '@nx/webpack';
import { DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './module-federation.config';

export default composePlugins(
  withModuleFederation({ ...baseConfig }, { dts: false }),

  (config) => {
    // ✅ reduce file watchers (fixes EMFILE)
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: [
        '**/node_modules/**',
        '**/.pnpm/**',
        '**/.git/**',
        '**/dist/**',
        '**/.nx/**',
        '**/.angular/**',
        '**/.cache/**',
        '**/tmp/**',

        // optional: don’t watch backend stuff while serving frontend
        '**/apps/server/**',
      ],
    };

    config.plugins ??= [];

    // 👇 patch Angular dev flags
    config.plugins.push(
      new DefinePlugin({
        ngDevMode: JSON.stringify(false),
        ngJitMode: JSON.stringify(false),
      }),
    );

    // 👇 analyzer only if enabled (recommended gate it!)
    // if (process.env.ANALYZE === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
    );
    // }

    return config;
  },
);
