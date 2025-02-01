import { environment as devEnv } from './lib/environments/environment';
import { environment as prodEnv } from './lib/environments/environment.prod';
import { environment as stagingEnv } from './lib/environments/environment.staging';

const ENV = process.env['NODE_ENV'] || 'development';

export const environment = (() => {
  switch (ENV) {
    case 'production':
      return prodEnv;
    case 'staging':
      return stagingEnv;
    default:
      return devEnv;
  }
})();
