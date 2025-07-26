// apps/eDB/module-federation.config.ts  (host)
import { ModuleFederationConfig } from '@nx/module-federation';

const eager = (reqVersion = '^20.1.3') => ({
  singleton: true,
  eager: true,
  requiredVersion: reqVersion,
  strictVersion: true,
});
const loose = { singleton: true, strictVersion: false, requiredVersion: false };

export default {
  name: 'eDB',
  remotes: ['eDB-admin'],
  exposes: {},
  shared: (pkg?: string) => {
    if (!pkg) return false;

    // Angular runtime – eager
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

    // rxjs – eager but with correct version
    if (pkg === 'rxjs') {
      return eager('^7.8.2'); // 🔑 here
    }

    // Material / CDK
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return eager(); // still ^20.1.3, but not eager
    }

    // Any other @angular/ entry point
    if (pkg.startsWith('@angular/')) {
      return eager(); // ^20.1.3
    }

    // Your own libs
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return loose;
    }

    return false;
  },
} satisfies ModuleFederationConfig;
