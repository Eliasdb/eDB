// apps/client/mfe-edb-admin/src/app/remote-entry/entry.routes.ts
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
