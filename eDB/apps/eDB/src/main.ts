// src/main.ts (or wherever you bootstrap)
import { registerRemotes } from '@module-federation/enhanced/runtime';
import { environment } from './environments/environment';

const manifestUrl = `${environment.mfManifestBaseUrl}/mf-manifest.json`;

// apps/eDB/src/main.ts or similar entrypoint
// import {
//   ArcElement,
//   BarController,
//   BarElement,
//   CategoryScale,
//   Chart,
//   Legend,
//   LinearScale,
//   LineController,
//   LineElement,
//   PieController,
//   Tooltip,
// } from 'chart.js';

// Chart.register(
//   LinearScale,
//   CategoryScale,
//   LineController,
//   LineElement,
//   BarElement,
//   BarController,
//   ArcElement,
//   PieController,
//   Tooltip,
//   Legend,
// );

// console.log('✅ Chart.js registered once in host:', Chart);

if (!environment.production) {
  // DEV: ping the local manifest, only register if it’s up
  fetch(manifestUrl, { method: 'HEAD' })
    .then((res) => {
      if (res.ok) {
        registerRemotes([{ name: 'eDB-admin', entry: manifestUrl }]);
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
  // STAGING & PROD: assume manifest is always there
  registerRemotes([{ name: 'eDB-admin', entry: manifestUrl }]);
}

import('./bootstrap');
