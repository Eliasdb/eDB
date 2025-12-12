console.log('🛠️  Using PRODUCTION webpack config for eDB-admin');

import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins } from '@nx/webpack';
import { DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import config from './module-federation.config';

export default composePlugins(
  withModuleFederation(
    {
      ...config,
      // optionally add remote URLs here
    },
    { dts: false },
  ),

  (config) => {
    config.plugins ??= [];
    config.plugins.push(
      new DefinePlugin({
        ngDevMode: JSON.stringify(false),
        ngJitMode: JSON.stringify(false),
      }),

      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      }),
    );

    return config;
  },
);
