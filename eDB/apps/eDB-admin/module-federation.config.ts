// apps/eDB-admin/module-federation.config.ts  (remote)

import { ModuleFederationConfig } from '@nx/module-federation';

/** eager singleton helper */
const eager = (requiredVersion = '^20.1.3') => ({
  singleton: true,
  eager: true,
  strictVersion: true,
  requiredVersion,
});

/** loose singleton helper for libs you own */
const loose = { singleton: true, strictVersion: false, requiredVersion: false };

export default {
  name: 'eDB-admin',

  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ──────────────────────────────────────────────────────────────
     * 1️⃣  Angular bootstrap libs  +  rxjs  – must be eager
     * ──────────────────────────────────────────────────────────── */
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

    if (pkg === 'rxjs') {
      return eager('^7.8.2'); // 🔑 correct version for rxjs
    }

    /* ──────────────────────────────────────────────────────────────
     * 2️⃣  Angular Material / CDK – regular strict singleton
     * ──────────────────────────────────────────────────────────── */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ──────────────────────────────────────────────────────────────
     * 3️⃣  Any other @angular/ entry point – strict singleton
     * ──────────────────────────────────────────────────────────── */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ──────────────────────────────────────────────────────────────
     * 4️⃣  Libraries you own – loose singleton
     * ──────────────────────────────────────────────────────────── */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return loose;
    }

    /* ──────────────────────────────────────────────────────────────
     * 5️⃣  Everything else – don’t share
     * ──────────────────────────────────────────────────────────── */
    return false;
  },
} satisfies ModuleFederationConfig;
