/******************************************************************
 *  main.ts
 ******************************************************************/

import { init } from '@module-federation/enhanced/runtime';
import { environment } from '../src/app/mfe-envs/environment';

async function start() {
  try {
    init({
      name: 'eDB',
      remotes: [
        {
          name: 'eDBAccountUi',
          entry: environment.remotes.eDBAccountUi,
        },
      ],
    });

    await import('./bootstrap');
  } catch (err) {
    console.error('❌ MF init failed:', err);
  }
}

start();
