import { Route } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

import { PlatformLayout } from './layouts/platform/platform.layout';
import { PortalLayout } from './layouts/portal/portal.layout';

export const routes: Route[] = [
  {
    path: '',
    component: PlatformLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@eDB/feature-dashboard').then(
            (m) => m.featureDashboardRoutes,
          ),
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('@eDB/feature-profile').then((m) => m.featureProfileRoutes),
      },

      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () =>
          import('@eDB/feature-admin').then((m) => m.featureAdminRoutes),
      },

      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB/feature-catalog').then((m) => m.featureCatalogRoutes),
      },
    ],
  },

  {
    path: 'auth',
    component: PortalLayout,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('@eDB/feature-login').then((m) => m.featureLoginRoutes),
        canActivate: [LoginGuard],
      },

      {
        path: 'register',
        loadChildren: () =>
          import('@eDB/feature-register').then((m) => m.featureRegisterRoutes),
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
    loadChildren: () =>
      import('@eDB/feature-404').then((m) => m.feature404Routes),
  },

  {
    path: '**',
    redirectTo: 'not-found',
  },
];
