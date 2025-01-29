import { Route } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@eDB/feature-dashboard' /* webpackChunkName: "dashboard" */).then(
        (m) => m.featureDashboardRoutes,
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import(
            '@eDB/feature-dashboard' /* webpackChunkName: "dashboard" */
          ).then((m) => m.featureDashboardRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@eDB/feature-profile' /* webpackChunkName: "profile" */).then(
            (m) => m.featureProfileRoutes,
          ),
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB/feature-catalog' /* webpackChunkName: "catalog" */).then(
            (m) => m.featureCatalogRoutes,
          ),
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('@eDB/feature-login' /* webpackChunkName: "login" */).then(
            (m) => m.featureLoginRoutes,
          ),
        canActivate: [LoginGuard],
      },
      {
        path: 'register',
        loadChildren: () =>
          import(
            '@eDB/feature-register' /* webpackChunkName: "register" */
          ).then((m) => m.featureRegisterRoutes),
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import(
        '@eDB/appointment-app' /* webpackChunkName: "appointments" */
      ).then((m) => m.AppointmentsModule),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('@eDB/feature-404' /* webpackChunkName: "not-found" */).then(
        (m) => m.feature404Routes,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
