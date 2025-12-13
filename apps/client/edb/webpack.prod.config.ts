import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins } from '@nx/webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './module-federation.config';

export default composePlugins(
  withModuleFederation(
    {
      ...baseConfig,
    },
    { dts: false },
  ),

  // 👇 extra plugin only in prod
  (config) => {
    config.plugins ??= [];

    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: Number(process.env.ANALYZE_PORT ?? 8888),
          openAnalyzer: true,
        }),
      );
    }

    return config;
  },
);
