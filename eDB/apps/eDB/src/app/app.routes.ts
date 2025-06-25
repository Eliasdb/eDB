import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

import { AuthGuard } from './guards/auth.guard';
import { LogoutHandlerComponent } from './logout-handler.component';
import { WrapperComponent } from './wrapReact';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard], // keep guards here if you need them
    children: [
      /* redirect plain slash to /dashboard */

      /* real dashboard segment */
      {
        path: '',
        loadChildren: () =>
          import('@eDB/feature-dashboard').then(
            (m) => m.featureDashboardRoutes,
          ),
      },

      /* remote admin */
      {
        path: 'admin',
        loadChildren: () =>
          loadRemote<{ default: Route[] }>('eDB-admin/Routes').then(
            (m) => m!.default,
          ), // ⟵ return the array itself
      },

      /* rest of your routes */
      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB/feature-catalog').then((m) => m.featureCatalogRoutes),
      },
      {
        path: 'webshop',
        loadChildren: () => import('@eDB-webshop').then((m) => m.WebshopModule),
      },
      {
        path: 'account',
        component: WrapperComponent,
        canActivate: [AuthGuard],
      },
      { path: 'logout', component: LogoutHandlerComponent },
    ],
  },

  /* 404 */
  {
    path: 'not-found',
    loadChildren: () =>
      import('@eDB/feature-404').then((m) => m.feature404Routes),
  },
  { path: '**', redirectTo: 'not-found' },
];
