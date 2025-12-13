import { createInstance, registerRemotes } from '@module-federation/enhanced/runtime';
import { environment } from './environments/environment';

const manifestUrl = `${environment.mfManifestBaseUrl}/mf-manifest.json`;
const remotes = [{ name: 'mfe-edb-admin', entry: manifestUrl }];

// I get a bug in dev env when I remove this...
(window as typeof window & { ngDevMode?: boolean }).ngDevMode = true;

// Only do MF wiring if explicitly enabled for this env
if (environment.mfEnableRemotes) {
  // Ensure the runtime instance exists before calling loadRemote().
  createInstance({ name: 'edb', remotes });

  if (!environment.production) {
    // DEV/STAGING: ping the manifest, only register if it’s up.
    fetch(manifestUrl, { method: 'GET' })
      .then((res) => {
        if (res.ok) {
          registerRemotes(remotes);
        } else {
          console.warn(
            'Admin manifest not found (dev), skipping remote registration',
          );
        }
      })
      .catch(() => {
        console.warn(
          'Failed to reach admin manifest (dev), skipping remote registration',
        );
      });
  } else {
    // PROD: assume manifest is always there.
    registerRemotes(remotes);
  }
}

import('./bootstrap');
