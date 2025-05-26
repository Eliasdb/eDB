// apps/eDB/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';
import { environment } from './src/environments/environment';

const config: ModuleFederationConfig = {
  name: 'eDB',
  remotes: [
    ['eDB-admin', `${environment.mfManifestBaseUrl}/remoteEntry.mjs`], // this is used only for dev
  ],
};

export default config;
