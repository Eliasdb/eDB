// apps/eDB/webpack.prod.config.ts
import { withModuleFederation } from '@nx/module-federation/angular';
import baseConfig from './module-federation.config';

const prodConfig = {
  ...baseConfig,
  remotes: [
    // tell TS “this is exactly a [string, string] tuple”
    [
      'eDB-admin',
      'https://app.staging.eliasdebock.com/admin/remoteEntry.mjs',
    ] as [string, string],
  ],
};

export default withModuleFederation(prodConfig, { dts: false });
