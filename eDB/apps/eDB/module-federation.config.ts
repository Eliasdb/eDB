// apps/eDB/module-federation.config.ts   (HOST)
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'],

  shared: (pkg) => {
    if (!pkg) return false;

    // 1) share *every* Angular entry point (and its sub‑paths)
    if (pkg.startsWith('@angular/')) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }

    // 2) other libraries that must stay singleton
    if (
      pkg === 'rxjs' ||
      pkg.startsWith('@angular/material') ||
      pkg.startsWith('@angular/cdk') ||
      pkg === '@tanstack/angular-query-experimental' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@edb/shared-ui'
    ) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }

    // 3) everything else is not shared
    return false;
  },
};

export default config;
