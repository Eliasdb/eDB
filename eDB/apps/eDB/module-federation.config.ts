// apps/eDB/module-federation.config.ts  (HOST)

import { ModuleFederationConfig } from '@nx/module-federation';

/* reusable “just‑make‑it‑singleton” helper */
const SINGLETON = {
  singleton: true,
  strictVersion: false,
  requiredVersion: false,
} as const;

const config: ModuleFederationConfig = {
  name: 'eDB',

  exposes: {},
  remotes: ['eDB-admin'],

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ---------- Angular animations (both entry‑points) ------------------ */
    if (
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser' ||
      pkg === '@angular/platform-browser/animations'
    ) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
        eager: true, // ← prevents the RUNTIME‑006 error
      };
    }

    /* ---------- libraries you control / don’t version‑check ------------- */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental' ||
      pkg === 'rxjs'
    ) {
      return SINGLETON;
    }

    /* ---------- Angular Material & CDK ---------------------------------- */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------- every other Angular entry‑point ------------------------- */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------- everything else: don’t share ---------------------------- */
    return false;
  },
};

export default config;
