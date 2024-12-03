import { Route } from '@angular/router';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./user-detail/user-detail.page').then((m) => m.UserDetailPage),
  },
];
