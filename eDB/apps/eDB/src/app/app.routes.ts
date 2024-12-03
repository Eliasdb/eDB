import { Route } from '@angular/router';
import { PlatformLayout } from './layouts/platform/platform.layout';
import { PortalLayout } from './layouts/portal/portal.layout';
import { LoginPage } from './pages/portal/login/login.page';
import { RegisterPage } from './pages/portal/register/register.page';

export const routes: Route[] = [
  {
    path: '',
    component: PlatformLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/platform/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/platform/profile/profile.page').then(
            (m) => m.ProfilePage
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/platform/admin/admin.routes').then(
            (m) => m.ADMIN_ROUTES
          ), // Lazy load the admin routes
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./pages/platform/catalog/catalog.page').then(
            (m) => m.CatalogPage
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: PortalLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
    ],
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
