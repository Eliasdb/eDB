/**
 * apps/eDB/module-federation.config.ts  (host)
 * ASCII-only, CI-friendly
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

const looseSingletonPackages = new Set([
  '@carbon/styles',
  '@eDB/client-admin',
  '@eDB/shared-env',
  '@edb/shared-types',
  '@edb/shared-ui',
  '@edb/util-common',
  '@edb/util-user-params',
  '@fortawesome/angular-fontawesome',
  '@microsoft/signalr',
  '@tanstack/angular-query-experimental',
  '@tanstack/query-core',
  'carbon-components',
  'carbon-components-angular',
  'chart.js',
  'ng2-charts',
]);

const targetConfiguration =
  process.env.NX_TASK_TARGET_CONFIGURATION ??
  process.env.NODE_ENV ??
  'development';

const adminRemoteEntry =
  process.env.MFE_EDB_ADMIN_REMOTE_ENTRY ??
  (targetConfiguration === 'production'
    ? 'https://app.eliasdebock.com/admin/remoteEntry.mjs'
    : targetConfiguration === 'staging'
      ? 'https://app.staging.eliasdebock.com/admin/remoteEntry.mjs'
      : 'http://localhost:4300/remoteEntry.mjs');

export default {
  name: 'edb',
  remotes: [['mfe-edb-admin', adminRemoteEntry]],
  exposes: {},

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
      looseSingletonPackages.has(pkg) ||
      pkg.startsWith('carbon-components-angular/')
    ) {
      return loose;
    }

    // 5. Everything else – do not share.
    return false;
  },
} satisfies ModuleFederationConfig;
