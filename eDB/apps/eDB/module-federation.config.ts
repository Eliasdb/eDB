// apps/eDB/module-federation.config.ts (host)

import { ModuleFederationConfig } from '@nx/module-federation';

/** eager singleton helper (used only for core + RxJS) */
const eager = (requiredVersion = '^20.1.3') => ({
  singleton: true,
  eager: true,
  strictVersion: true,
  requiredVersion,
});

/** loose singleton helper for libs you own */
const loose = { singleton: true, strictVersion: false, requiredVersion: false };

export default {
  name: 'eDB',
  remotes: ['eDB-admin'],
  exposes: {},

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ───────────────────────────────────────────────
     * 1️⃣  Angular runtime (must stay eager)
     * ───────────────────────────────────────────── */
    if (
      pkg === '@angular/core' ||
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser'
    ) {
      return eager(); // ^20.1.3
    }

    /* ───────────────────────────────────────────────
     * 2️⃣  RxJS (single copy, eager)
     * ───────────────────────────────────────────── */
    if (pkg === 'rxjs') {
      return eager('^7.8.2');
    }

    /* ───────────────────────────────────────────────
     * 3️⃣  Angular Material / CDK – strict singleton
     * ───────────────────────────────────────────── */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ───────────────────────────────────────────────
     * 4️⃣  Any other @angular/* entry point
     * ───────────────────────────────────────────── */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ───────────────────────────────────────────────
     * 5️⃣  Libraries you own – loose singleton
     * ───────────────────────────────────────────── */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return loose;
    }

    /* ───────────────────────────────────────────────
     * 6️⃣  Everything else – do not share
     * ───────────────────────────────────────────── */
    return false;
  },
} satisfies ModuleFederationConfig;
