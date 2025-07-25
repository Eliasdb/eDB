// apps/eDB/webpack.prod.config.ts
import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins, withNx } from '@nx/webpack';
import { DefinePlugin } from 'webpack';
import baseConfig from './module-federation.config';

export default composePlugins(
  withNx(),
  withModuleFederation(
    {
      ...baseConfig,
      /* remotes, exposes, etc. */
    },
    { dts: false },
  ),
  // <── our custom plugin
  (config) => {
    config.plugins ??= [];
    config.plugins.push(
      new DefinePlugin({
        ngDevMode: JSON.stringify(false),
        ngJitMode: JSON.stringify(false),
      }),
    );
    return config;
  },
);
