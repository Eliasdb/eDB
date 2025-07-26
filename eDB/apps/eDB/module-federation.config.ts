// apps/eDB/module-federation.config.ts  (host)
import { ModuleFederationConfig } from '@nx/module-federation';

const eager = (pkg: string) => ({
  singleton: true,
  eager: true,
  requiredVersion: '^20.1.3',
  strictVersion: true,
});
const loose = { singleton: true, strictVersion: false, requiredVersion: false };

export default {
  name: 'eDB',
  remotes: ['eDB-admin'],
  exposes: {},
  shared: (pkg?: string) => {
    if (!pkg) return false;

    if (
      pkg === '@angular/core' ||
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser' ||
      pkg === 'rxjs'
    )
      return eager(pkg);

    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk'))
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };

    if (pkg.startsWith('@angular/'))
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };

    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    )
      return loose;

    return false;
  },
} satisfies ModuleFederationConfig;
