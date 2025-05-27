import { environment } from './environments/environment';

if (!environment.production) {
  // ➜ dev only
  import('@module-federation/enhanced/runtime').then(({ init }) => {
    init({
      name: 'eDB',
      remotes: [
        {
          name: 'eDB-admin',
          entry: `${environment.mfManifestBaseUrl}/mf-manifest.json`,
        },
      ],
    });
  });
}

// in both dev & prod, we still bootstrap the Angular app:
import('./bootstrap');
