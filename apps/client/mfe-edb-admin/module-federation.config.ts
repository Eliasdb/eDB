/**
 * apps/eDB-admin/module-federation.config.ts  (remote)
 * ASCII‑only, CI‑friendly
 */
import {
  ModuleFederationConfig,
  SharedLibraryConfig,
} from '@nx/module-federation';

/* eager singleton helper (core Angular + RxJS only) */
const eager = (requiredVersion = '^20.1.3'): SharedLibraryConfig => ({
  singleton: true,
  eager: true,
  strictVersion: true,
  requiredVersion,
});

/* loose singleton helper (your own libs) */
const loose: SharedLibraryConfig = {
  singleton: true,
  strictVersion: false,
  requiredVersion: false,
};

export default {
  name: 'mfe-edb-admin',

  exposes: {
    './Routes':
      'apps/client/mfe-edb-admin/src/app/remote-entry/entry.routes.ts',
  },

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* 1. Angular core runtime – eager */
    if (
      pkg === '@angular/core' ||
      pkg.startsWith('@angular/core/') ||
      pkg === '@angular/common' ||
      pkg.startsWith('@angular/common/') || // covers /http, /testing, …
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser'
    ) {
      return eager(); // ^20.1.3
    }

    /* 2. RxJS – eager (own version) */
    if (pkg === 'rxjs') {
      return eager('^7.8.2');
    }

    /* 3. Angular Material / CDK – strict singleton */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* 4. any other @angular/* entry point – strict singleton */
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    /* 5. libs you own – loose singleton */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return loose;
    }

    /* 6. everything else – do not share */
    return false;
  },
} satisfies ModuleFederationConfig;
