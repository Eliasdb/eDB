import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',

    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
