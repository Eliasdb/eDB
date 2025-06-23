// apps/eDB/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const map: Record<string, any> = {
  /* --- Angular core (already added) ------------------------------ */
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/common/http': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },

  /* --- Carbon for Angular & friends ------------------------------ */
  'carbon-components-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '5.57.8',
  },
  '@carbon/icons-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },

  '@tanstack/angular-query-experimental': {
    singleton: true,
    strictVersion: true, // fail fast if they drift
    requiredVersion: '5.62.2', // pick **one** patch
  },

  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/platform-browser/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },

  /* --- your workspace libs -------------------------------------- */
  // '@eDB/client-auth': { singleton: true, strictVersion: false },
  // '@eDB/shared-ui': { singleton: true, strictVersion: false },
  '@eDB/shared-ui': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto', // let webpack read the semver ↑
  },
  '@edb/client-auth': {
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  },

  // 'chart.js': {
  //   // 👇 **new:** tell webpack to treat Chart.js as a *synchronous* share
  //   // because we import it at bootstrap time (no async boundary before it)
  //   singleton: true,
  //   strictVersion: true,
  //   requiredVersion: '4.4.8',
  //   eager: true,
  // },
  // '@eDB/util-navigation': { singleton: true, strictVersion: false },
};

const config: ModuleFederationConfig = {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'], // ✅ This line tells Webpack that it's a dynamic remote

  shared: (lib) => map[lib] ?? false,
};

export default config;
