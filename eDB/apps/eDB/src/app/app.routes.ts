import { Route } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

import { PlatformLayout } from './layouts/platform/platform.layout';
import { PortalLayout } from './layouts/portal/portal.layout';

import { NotFoundPage } from './pages/404/not-found.page';
import { LoginPage } from './pages/portal/login/login.page';
import { RegisterPage } from './pages/portal/register/register.page';

export const routes: Route[] = [
  {
    path: '',
    component: PlatformLayout,
    canActivate: [AuthGuard],
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
            (m) => m.ProfilePage,
          ),
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () =>
          import('./pages/platform/admin/admin.routes').then(
            (m) => m.ADMIN_ROUTES,
          ), // Lazy load the admin routes
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./pages/platform/catalog/catalog.page').then(
            (m) => m.CatalogPage,
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
        canActivate: [LoginGuard],
      },
      {
        path: 'register',
        component: RegisterPage,
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },

  {
    path: 'not-found',
    component: NotFoundPage, // Add the not-found route
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
