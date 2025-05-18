/******************************************************************
 *  main.ts
 ******************************************************************/
import { environment } from '@eDB/shared-env'; // adjust path to your env
import { init } from '@module-federation/enhanced/runtime';

// Register MF runtime
init({
  name: 'eDB',
  remotes: environment.moduleFederationRemotes,
});

import('./bootstrap').catch((err) => console.error(err));
