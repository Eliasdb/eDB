// apps/eDB-admin/module-federation.config.ts  (remote)
import { ModuleFederationConfig } from '@nx/module-federation';

const eager = (pkg: string) => ({
  singleton: true,
  eager: true,
  requiredVersion: '^20.1.3',
  strictVersion: true,
});

export default {
  name: 'eDB-admin',
  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },
  shared: (pkg?: string) => {
    if (!pkg) return false;

    // 1. Angular bootstrap libs  +  rxjs
    if (
      pkg === '@angular/core' ||
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser' ||
      pkg === 'rxjs'
    ) {
      return eager(pkg);
    }

    // 2. material / cdk – normal singleton
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    // 3. everything else that starts with @angular/
    if (pkg.startsWith('@angular/')) {
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };
    }

    // 4. libs you own – loose singleton
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    ) {
      return { singleton: true, strictVersion: false, requiredVersion: false };
    }

    // 5. don’t share the rest
    return false;
  },
} satisfies ModuleFederationConfig;
