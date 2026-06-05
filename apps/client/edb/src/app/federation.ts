import { Route } from '@angular/router';
import {
  createInstance,
  loadRemote,
  registerRemotes,
} from '@module-federation/enhanced/runtime';
import { environment } from '../environments/environment';

const manifestUrl = `${environment.mfManifestBaseUrl}/mf-manifest.json`;
const remotes = [{ name: 'mfe-edb-admin', entry: manifestUrl }];
let initialized = false;

export function ensureFederationRuntime() {
  if (!environment.mfEnableRemotes || initialized) {
    return;
  }

  createInstance({ name: 'edb', remotes });
  registerRemotes(remotes);
  initialized = true;
}

export function loadAdminRemoteRoutes() {
  ensureFederationRuntime();
  return loadRemote<{ default: Route[] }>('mfe-edb-admin/Routes').then(
    (m) => m?.default ?? [],
  );
}
