export const environment = {
  production: false,
  apiBaseUrl: 'https://api.staging.eliasdebock.com/platform/api',
  apiAdminUrl: 'https://api.staging.eliasdebock.com/platform/api/admin',
  apiAuthUrl: 'https://api.staging.eliasdebock.com/platform/api/auth',
  bookAPIUrl: 'https://api.staging.eliasdebock.com/webshop/api/v1',
  KC: {
    url: 'https://app.staging.eliasdebock.com/keycloak',
    account:
      'https://app.staging.eliasdebock.com/keycloak/realms/EDB%20STAGING/account',
    realm: 'EDB STAGING',
    clientId: 'edb-app-staging',
  },
};
