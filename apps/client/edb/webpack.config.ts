// apps/eDB/webpack.config.ts
import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins } from '@nx/webpack';
import { DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './module-federation.config';

export default composePlugins(
  withModuleFederation({ ...baseConfig }, { dts: false }),

  (config) => {
    config.plugins ??= [];

    // 👇 patch Angular dev flags
    config.plugins.push(
      new DefinePlugin({
        ngDevMode: JSON.stringify(false),
        ngJitMode: JSON.stringify(false),
      }),
    );

    // 👇 add analyzer only if enabled

    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
    );

    return config;
  },
);
