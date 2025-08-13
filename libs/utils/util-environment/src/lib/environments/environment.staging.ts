export const environment = {
  production: false,
  apiBaseUrl: 'https://api.staging.eliasdebock.com/platform/api',
  apiAdminUrl: 'https://api.staging.eliasdebock.com/admin/api',
  apiAdminStreamUrl: 'https://api.staging.eliasdebock.com/admin',
  bookAPIUrl: 'https://api.staging.eliasdebock.com/webshop/api/v1',
  invoicesAPIUrl: 'https://api.staging.eliasdebock.com',

  KC: {
    url: 'https://app.staging.eliasdebock.com/keycloak',
    account:
      'https://app.staging.eliasdebock.com/keycloak/realms/EDB-STAGING/account',
    realm: 'EDB-STAGING',
    clientId: 'edb-app-staging',
  },
};
