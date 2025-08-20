import { Route } from '@angular/router';

export const adminRemoteRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];

export default adminRemoteRoutes;
