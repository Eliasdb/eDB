// apps/eDB/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'eDB',
  remotes: ['eDBAccountUi'],
};

export default config;
