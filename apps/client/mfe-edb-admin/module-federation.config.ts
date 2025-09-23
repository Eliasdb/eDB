/**
 * apps/eDB-admin/module-federation.config.ts  (remote)
 */
import {
  ModuleFederationConfig,
  SharedLibraryConfig,
} from '@nx/module-federation';

/* strict singleton helper (core Angular + RxJS only) */
const strict = (requiredVersion = '^20.2.4'): SharedLibraryConfig => ({
  singleton: true,
  strictVersion: true,
  requiredVersion,
});

/* loose singleton helper (your own libs + UI kits) */
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

    // 1. Angular core runtime – strict singleton
    if (
      pkg === '@angular/core' ||
      pkg.startsWith('@angular/core/') ||
      pkg === '@angular/common' ||
      pkg.startsWith('@angular/common/') ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/router'
    ) {
      return strict(); // ^20.2.4
    }

    // 2. RxJS – strict singleton
    if (pkg === 'rxjs') {
      return strict('^7.8.2');
    }

    // 3. Angular Material / CDK – strict singleton
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return strict();
    }

    // 4. Your shared libs / UI kits – loose singleton
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return loose;
    }

    // 5. Everything else – do not share
    return false;
  },
} satisfies ModuleFederationConfig;
