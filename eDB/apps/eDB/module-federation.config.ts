// apps/eDB/module-federation.config.ts  (HOST)
import { ModuleFederationConfig } from '@nx/module-federation';

/** quick helper for third‑party libs you own */
const SINGLETON = {
  singleton: true,
  strictVersion: false,
  requiredVersion: false,
} as const;

/** eager singleton for every runtime‑critical Angular package */
const ANGULAR_EAGER = {
  singleton: true,
  strictVersion: true,
  requiredVersion: '^20.1.3',
  eager: true,
};

export default {
  name: 'eDB',
  exposes: {},
  remotes: ['eDB-admin'],

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ---------------------------------------------------------------
     * 1️⃣  Core Angular runtime entry points ‑ must be eager
     * ------------------------------------------------------------- */
    if (
      pkg === '@angular/core' ||
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser'
    ) {
      return ANGULAR_EAGER;
    }

    /* ---------------------------------------------------------------
     * 2️⃣  Libraries you control / don’t strict‑version
     * ------------------------------------------------------------- */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental' ||
      pkg === 'rxjs'
    ) {
      return SINGLETON;
    }

    /* ---------------------------------------------------------------
     * 3️⃣  Angular Material & CDK
     * ------------------------------------------------------------- */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------------------------------------------------------------
     * 4️⃣  Any other Angular entry point
     * ------------------------------------------------------------- */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------------------------------------------------------------
     * 5️⃣  Everything else – do NOT share
     * ------------------------------------------------------------- */
    return false;
  },
} satisfies ModuleFederationConfig;
