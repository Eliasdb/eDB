import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

import { AuthGuard } from './guards/auth.guard';
import { LogoutHandlerComponent } from './logout-handler.component';
import { WrapperComponent } from './wrapReact';

interface AdminRemoteModule {
  remoteRoutes: Route[];
}

export const routes: Route[] = [
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
        path: 'admin',
        loadChildren: () =>
          loadRemote('eDB-admin/Routes')
            .then((m) => (m as AdminRemoteModule).remoteRoutes ?? [])
            .catch(() => []),
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
      {
        path: 'logout',
        component: LogoutHandlerComponent,
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
