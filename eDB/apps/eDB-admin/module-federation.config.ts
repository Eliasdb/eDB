// module-federation.config.ts  – host or remote
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB-admin',
  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },

  shared: (lib) => {
    if (!lib) return false;

    /** 1 . share *all* Angular entry‑points (and sub‑paths) as one singleton */
    if (lib.startsWith('@angular/')) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }

    /** 2 . other libraries you really want single‑instanced */
    if (lib.startsWith('@angular/material') || lib.startsWith('@angular/cdk')) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }
    if (
      lib === 'rxjs' ||
      lib === '@tanstack/angular-query-experimental' ||
      lib === 'carbon-components-angular' ||
      lib === '@edb/shared-ui'
    ) {
      return { singleton: true, strictVersion: true, requiredVersion: 'auto' };
    }

    /** 3 . everything else: don't share */
    return false;
  },
};

export default config;
