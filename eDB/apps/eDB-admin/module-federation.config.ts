// apps/eDB-admin/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const map: Record<string, any> = {
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
  '@angular/forms': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
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
  'carbon-components-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '5.58.0',
  },
  '@tanstack/angular-query-experimental': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '5.62.2',
  },
  '@edb/shared-ui': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '0.0.1',
    import: false, // 👈 CRUCIAL: tells Webpack not to bundle it here
  },
  '@angular/cdk': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.1.5',
  },
};

const config: ModuleFederationConfig = {
  name: 'eDB-admin',

  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },

  shared: (libraryName) => {
    if (!libraryName) return false;
    if (libraryName.startsWith('@angular/material')) {
      return { singleton: true, strictVersion: true };
    }
    return map[libraryName] ?? false;
  },
};

export default config;
