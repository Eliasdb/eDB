// apps/eDB/module-federation.config.ts  (host)

import { ModuleFederationConfig } from '@nx/module-federation';

const eager = (requiredVersion = '^20.1.3') => ({
  singleton: true,
  eager: true,
  strictVersion: true,
  requiredVersion,
});
const loose = { singleton: true, strictVersion: false, requiredVersion: false };

export default {
  name: 'eDB',
  remotes: ['eDB-admin'],
  exposes: {},

  shared: (pkg?: string) => {
    if (!pkg) return false;

    /* ───────────────────── 1. core runtime – eager ─────────────────── */
    if (
      pkg === '@angular/core' ||
      pkg.startsWith('@angular/core/') // <── NEW: *all* sub‑paths
    )
      return eager(); // ^20.1.3

    if (
      pkg === '@angular/common' ||
      pkg === '@angular/platform-browser' ||
      pkg === '@angular/platform-browser/animations' ||
      pkg === '@angular/animations' ||
      pkg === '@angular/animations/browser'
    )
      return eager(); // ^20.1.3

    /* ───────────────────── 2. RxJS – eager ─────────────────────────── */
    if (pkg === 'rxjs') return eager('^7.8.2');

    /* ───────────────────── 3. Material/CDK ─────────────────────────── */
    if (pkg.startsWith('@angular/material') || pkg.startsWith('@angular/cdk'))
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };

    /* ───────────────────── 4. other @angular/*  — NOT eager ────────── */
    if (pkg.startsWith('@angular/'))
      return {
        singleton: true,
        strictVersion: true,
        requiredVersion: '^20.1.3',
      };

    /* ───────────────────── 5. your own libs – loose ────────────────── */
    if (
      pkg === '@edb/shared-ui' ||
      pkg === 'carbon-components-angular' ||
      pkg === '@tanstack/angular-query-experimental'
    )
      return loose;

    /* ───────────────────── 6. everything else – don’t share ───────── */
    return false;
  },
} satisfies ModuleFederationConfig;
