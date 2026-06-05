/**
 * apps/eDB-admin/module-federation.config.ts  (remote)
 */
import {
  ModuleFederationConfig,
  SharedLibraryConfig,
} from '@nx/module-federation';

/* strict singleton helper (core Angular + RxJS only) */
const strict = (requiredVersion = '21.0.5'): SharedLibraryConfig => ({
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

    // 1. Angular Material / CDK – strict singleton
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return strict('21.0.3');
    }

    // 2. All remaining Angular packages – strict singleton
    if (pkg.startsWith('@angular/')) {
      return strict(); // 21.0.5
    }

    // 3. RxJS – strict singleton
    if (pkg === 'rxjs') {
      return strict('^7.8.2');
    }

    // 4. Your shared libs / UI kits – loose singleton
    if (
      pkg === '@edb/shared-ui' ||
      pkg === '@edb/shared-types' ||
      pkg === 'carbon-components-angular' ||
      pkg === 'carbon-components' ||
      pkg === '@carbon/styles' ||
      pkg === '@tanstack/angular-query-experimental' ||
      pkg === '@tanstack/query-core' ||
      pkg === 'chart.js' ||
      pkg === 'ng2-charts'
    ) {
      return loose;
    }

    // 5. Everything else – do not share
    return false;
  },
} satisfies ModuleFederationConfig;
