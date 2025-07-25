import { ModuleFederationConfig } from '@nx/module-federation';

const map: Record<string, any> = {
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/common/http': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/forms': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/platform-browser/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },

  '@angular/core/rxjs-interop': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  '@angular/cdk': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
  'carbon-components-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '5.59.0',
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
  },
  rxjs: {
    singleton: true,
    strictVersion: true,
    requiredVersion: '7.8.2',
  },
  '@angular/compiler': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '20.1.3',
  },
};

const config: ModuleFederationConfig = {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'],
  shared: (libraryName) => {
    if (!libraryName) return false;
    if (libraryName.startsWith('@angular/material')) {
      return { singleton: true, strictVersion: true };
    }
    return map[libraryName] ?? false;
  },
};

export default config;
