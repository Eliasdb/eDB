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
    requiredVersion: '5.58.0',
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

  '@angular/forms': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },

  /* --- your workspace libs -------------------------------------- */
  '@edb/shared-ui': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '0.0.1', // let webpack read the semver ↑
  },
};

const config: ModuleFederationConfig = {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'], // ✅ This line tells Webpack that it's a dynamic remote

  shared: (lib) => map[lib] ?? false,
};

export default config;
