import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB-admin',
  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },
  shared: (name, sharedConfig) => {
    if (name === 'chart.js' || name === 'ng2-charts') {
      return {
        singleton: true,
        eager: false,
        strictVersion: false,
        requiredVersion: sharedConfig?.requiredVersion ?? 'auto',
      };
    }
    return sharedConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
