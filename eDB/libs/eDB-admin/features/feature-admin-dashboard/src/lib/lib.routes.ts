import { Route } from '@angular/router';
import { AdminPage } from './admin.page';

export const featureAdminDashboardRoutes: Route[] = [
  { path: '', component: AdminPage },
  {
    path: 'users/:id',
    loadComponent: () =>
      import(
        /* webpackChunkName: "user-detail" */ './components/platform/user-detail/user-detail.page'
      ).then((m) => m.UserDetailPage),
  },
];
