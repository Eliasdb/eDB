import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

import { AuthGuard } from './guards/auth.guard';
import { WrapperComponent } from './wrapReact';

export const routes: Route[] = [
  {
    path: 'admin',
    loadChildren: () =>
      loadRemote('admin/Routes') // ← no second argument, no TS error
        .then((m: any) => m.remoteRoutes ?? [])
        .catch(() => []), // graceful empty fallback
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            '@eDB/feature-dashboard' /* webpackChunkName: "dashboard" */
          ).then((m) => m.featureDashboardRoutes),
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB/feature-catalog' /* webpackChunkName: "catalog" */).then(
            (m) => m.featureCatalogRoutes,
          ),
      },
      {
        path: 'webshop',
        loadChildren: () =>
          import('@eDB-webshop' /* webpackChunkName: "webshop" */).then(
            (m) => m.WebshopModule,
          ),
      },
      {
        path: 'account',
        component: WrapperComponent,
        canActivate: [AuthGuard],
      },
    ],
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
