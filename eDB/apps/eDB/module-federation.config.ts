import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB',
  shared: (name, sharedConfig) => {
    if (name === 'chart.js' || name === 'ng2-charts') {
      return {
        singleton: true,
        strictVersion: false,
        eager: false,

        requiredVersion: sharedConfig?.requiredVersion ?? 'auto',
      };
    }
    return sharedConfig;
  },
};

export default config;
