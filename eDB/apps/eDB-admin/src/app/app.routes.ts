import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import(
            '@eDB/feature-admin-dashboard' /* webpackChunkName: "dashboard" */
          ).then((m) => m.featureAdminDashboardRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
