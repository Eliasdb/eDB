// apps/eDB/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const map: Record<string, any> = {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },

  '@eDB/client-auth': { singleton: true, strictVersion: false },

  '@eDB/shared-ui': { singleton: true, strictVersion: false },
  '@eDB/util-navigation': { singleton: true, strictVersion: false },
};

const config: ModuleFederationConfig = {
  name: 'eDB',
  // remotes: [
  //   [
  //     'eDB-admin',
  //     'https://app.staging.eliasdebock.com/admin/remoteEntry.mjs',
  //   ] as [string, string],
  // ],
  exposes: {},

  // 👇 real SharedFunction – fully typed
  shared: (libraryName) => map[libraryName] ?? false,
};

export default config;
