// apps/eDB-admin/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

/** simple helper we can reuse for third‑party libs you control */
const SINGLETON = {
  singleton: true,
  strictVersion: false,
  requiredVersion: false,
} as const;

/** eager singleton – same shape for all core Angular entry points */
const ANGULAR_EAGER = {
  singleton: true,
  strictVersion: true,
  requiredVersion: '^20.1.3',
  eager: true,
};

export default {
  name: 'eDB-admin',

  exposes: {
    /* remote entry with your standalone routes */
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ---------------------------------------------------------------
     * 1️⃣  Angular runtime entry points that must be eager
     * ------------------------------------------------------------- */
    if (
      pkg === '@angular/core' ||
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations'
    ) {
      return ANGULAR_EAGER;
    }

    /* ---------------------------------------------------------------
     * 2️⃣  Angular animations side‑packages (still need eager)
     * ------------------------------------------------------------- */
    if (
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser'
    ) {
      return ANGULAR_EAGER;
    }

    /* ---------------------------------------------------------------
     * 3️⃣  Libraries you own / don’t strict‑version
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
     * 4️⃣  Angular Material & CDK
     * ------------------------------------------------------------- */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------------------------------------------------------------
     * 5️⃣  All remaining Angular entry points
     * ------------------------------------------------------------- */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* ---------------------------------------------------------------
     * 6️⃣  Everything else – do NOT share
     * ------------------------------------------------------------- */
    return false;
  },
} satisfies ModuleFederationConfig;
