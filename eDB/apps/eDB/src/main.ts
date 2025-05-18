/******************************************************************
 *  main.ts
 ******************************************************************/
import { init } from '@module-federation/enhanced/runtime';

// Register MF runtime

async function start() {
  try {
    init({
      name: 'eDB',
      remotes: [
        {
          name: 'eDBAccountUi',
          entry: 'http://localhost:4301/mf-manifest.json',
        },
      ],
    });

    await import('./bootstrap');
  } catch (err) {
    console.error('❌ MF init failed:', err);
  }
}

start();

import('./bootstrap').catch((err) => console.error(err));
