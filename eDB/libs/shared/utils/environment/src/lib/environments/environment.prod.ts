export const environment = {
  production: true,
  apiBaseUrl: 'https://api.eliasdebock.com/platform/api',
  apiAdminUrl: 'https://api.eliasdebock.com/admin/api',
  bookAPIUrl: 'https://api.eliasdebock.com/webshop/api/v1',
  invoicesAPIUrl: 'https://api.eliasdebock.com',

  KC: {
    url: 'https://app.eliasdebock.com/keycloak',
    account: 'https://app.eliasdebock.com/keycloak/realms/EDB%20PROD/account',
    realm: 'EDB PROD',
    clientId: 'edb-app-prod',
  },
  // environment.staging.ts
  moduleFederationRemotes: [
    {
      name: 'eDBAccountUi',
      entry: 'https://app.eliasdebock.com/account/mf-manifest.json',
    },
  ],
};
