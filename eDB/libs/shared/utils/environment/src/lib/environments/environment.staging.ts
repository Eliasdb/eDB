export const environment = {
  production: false,
  apiBaseUrl: 'https://api.staging.eliasdebock.com/platform/api',
  apiAdminUrl: 'https://api.staging.eliasdebock.com/platform/api/admin',
  apiAuthUrl: 'https://api.staging.eliasdebock.com/platform/api/auth',
  bookAPIUrl: 'https://api.staging.eliasdebock.com/webshop/api/v1',
  KC: {
    url: 'https://app.staging.eliasdebock.com/keycloak',
    account:
      'https://app.staging.eliasdebock.com/keycloak/realms/eDB%20-%20Staging%20/account',
    realm: 'eDB - Staging',
    clientId: 'edb-app-staging',
  },
};
