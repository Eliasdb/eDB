import { Route } from '@angular/router';
import { AdminPage } from './admin.page';

export const featureAdminRoutes: Route[] = [
  { path: '', component: AdminPage },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./components/user-detail/user-detail.page').then(
        (m) => m.UserDetailPage,
      ),
  },
];
