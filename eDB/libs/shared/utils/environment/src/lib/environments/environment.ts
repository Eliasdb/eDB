// libs/shared/utils/environment/src/lib/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5098/api',
  apiAdminUrl: 'http://localhost:5206/api/admin',
  apiAuthUrl: 'http://localhost:5098/api/auth',
  bookAPIUrl: 'http://localhost:8000/api/v1',
  KC: {
    url: '/',
    account: 'http://localhost:8080/realms/eDB/account',
    realm: 'eDB',
    clientId: 'edb-app',
  },
  moduleFederationRemotes: [
    {
      name: 'eDBAccountUi',
      entry: 'http://localhost:4301/mf-manifest.json',
    },
  ],
};
