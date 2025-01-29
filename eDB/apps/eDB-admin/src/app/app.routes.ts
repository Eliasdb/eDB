import { Route } from '@angular/router';
import { AdminHomeComponent } from '../app/test/test.component';

export const routes: Route[] = [
  {
    path: '',
    component: AdminHomeComponent,
  },
  {
    path: 'dashboard',
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
