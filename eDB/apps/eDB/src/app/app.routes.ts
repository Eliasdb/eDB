import { Route } from '@angular/router';

import { loadRemote } from '@module-federation/enhanced/runtime';
import { AuthGuard } from './guards/auth.guard';
import { wrapReact } from './wrapReact';

export const routes: Route[] = [
  // {
  //   path: 'eDBAccountUi',
  //   loadChildren: () =>
  //     import('eDBAccountUi/Routes').then((m) => m!.remoteRoutes),
  // },

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
        canActivate: [AuthGuard],
        loadComponent: () =>
          loadRemote<{ default: any }>('eDBAccountUi/Module').then((r) => {
            if (!r) throw new Error('remote not found');
            return wrapReact(r.default); // 👈 single line
          }),
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
