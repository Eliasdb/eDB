import { registerRemotes } from '@module-federation/enhanced/runtime';
import { environment } from './environments/environment';

const manifestUrl = `${environment.mfManifestBaseUrl}/mf-manifest.json`;

if (!environment.production) {
  // DEV: ping the local manifest, only register if it’s up.
  fetch(manifestUrl, { method: 'GET' })
    .then((res) => {
      if (res.ok) {
        registerRemotes([{ name: 'mfe-edb-admin', entry: manifestUrl }]);
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
  // STAGING & PROD: assume manifest is always there.
  registerRemotes([{ name: 'mfe-edb-admin', entry: manifestUrl }]);
}

import('./bootstrap');
