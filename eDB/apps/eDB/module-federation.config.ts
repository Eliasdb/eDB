// apps/eDB/module-federation.config.ts  (HOST)
import { ModuleFederationConfig } from '@nx/module-federation';

/* one literal‑typed object we can reuse */
const SINGLETON = {
  singleton: true,
  strictVersion: false,
  requiredVersion: false,
} as const;

const config: ModuleFederationConfig = {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'],

  shared: (pkg) => {
    if (!pkg) return false;

    /* 1) packages you control or don’t care to version‑check */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental' ||
      pkg === 'rxjs'
    ) {
      return SINGLETON; // 👈 avoids the “needs auto” error
    }

    /* 2) Angular Material & CDK – keep strict version if you like */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* 3) every Angular entry point (and sub‑paths) */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
        includeSecondaries: true, // ←  **important!**
      };
    }

    /* 4) everything else: not shared */
    return false;
  },
};

export default config;
