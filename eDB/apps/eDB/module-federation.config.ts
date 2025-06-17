// apps/eDB/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB',
  // remotes: [
  //   ['eDB_admin', `${environment.mfManifestBaseUrl}/remoteEntry.mjs`], // this is used only for dev
  // ],
};

export default config;
