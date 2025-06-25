// apps/eDB-admin/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

/** ──────────────────────────────────────────────────────────────
 *  Shared map – keep it **identical** (or a subset) of the host
 *  so Nx/webpack can actually give you the same singletons.
 *  ────────────────────────────────────────────────────────────── */
const map: Record<string, any> = {
  /* --- Angular core (already added) ------------------------------ */
  '@angular/core': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/common': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/common/http': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/router': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },

  '@angular/platform-browser': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },
  '@angular/platform-browser/animations': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '19.0.3',
  },

  /* --- Carbon for Angular & friends ------------------------------ */
  'carbon-components-angular': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '5.58.0',
  },

  '@tanstack/angular-query-experimental': {
    singleton: true,
    strictVersion: true, // fail fast if they drift
    requiredVersion: '5.62.2', // pick **one** patch
  },
  // if you use secondary entry-points add them too, e.g.

  /* --- your workspace libs -------------------------------------- */
  '@edb/shared-ui': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '0.0.1', // let webpack read the semver ↑
  },
};

const config: ModuleFederationConfig = {
  /** the name under which the host imports this remote */
  name: 'eDB-admin',

  /** everything this remote exposes */
  exposes: {
    './Routes': 'apps/eDB-admin/src/app/remote-entry/entry.routes.ts',
  },

  /** 👉 must be a SharedFunction in Nx 20 */
  shared: (libraryName) => map[libraryName] ?? false,
};

export default config;
