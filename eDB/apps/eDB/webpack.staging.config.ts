import { withModuleFederation } from '@nx/module-federation/angular';
import { composePlugins } from '@nx/webpack';
import { DefinePlugin } from 'webpack';
import baseConfig from './module-federation.config';

export default composePlugins(
  // ✅ Correct usage: just call withNx with no params

  // ✅ wrap module federation config
  withModuleFederation(
    {
      ...baseConfig,
    },
    { dts: false },
  ),

  // ✅ Add workaround plugin to patch the options error
  (config, context, options = {}) => {
    // Optional safeguard: avoid error if options is undefined

    config.plugins ??= [];
    config.plugins.push(
      new DefinePlugin({
        ngDevMode: JSON.stringify(true),
        ngJitMode: JSON.stringify(false),
      }),
    );

    return config;
  },
);
