import { init } from '@module-federation/enhanced/runtime';
import { environment } from './environments/environment';

init({
  name: 'eDB',
  remotes: [
    {
      name: 'eDB-admin',
      entry: `${environment.mfManifestBaseUrl}/mf-manifest.json`,
    },
  ],
});

import('./bootstrap');
