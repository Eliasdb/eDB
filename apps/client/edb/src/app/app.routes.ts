import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { AuthGuard } from './guards/auth.guard';
import { WrapperComponent } from './wrapReact';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@eDB/feature-dashboard').then(
            (m) => m.featureDashboardRoutes,
          ),
      },

      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB/feature-catalog').then((m) => m.featureCatalogRoutes),
      },

      {
        path: 'account',
        component: WrapperComponent,
        canActivate: [AuthGuard],
      },

      /* Remote admin (Dynamic Module Federation) */
      {
        path: 'admin',
        loadChildren: () =>
          loadRemote<{ default: Route[] }>('eDB-admin/Routes').then(
            (m) => m!.default,
          ),
      },

      /* Demo applications. */

      {
        path: 'webshop',
        loadChildren: () =>
          import('@edb/feature-webshop').then((m) => m.featureWebshopRoutes),
      },
      {
        path: 'crm',
        loadChildren: () =>
          import('@edb/feature-crm').then((m) => m.featureCRMRoutes),
      },
      {
        path: 'erp',
        loadChildren: () =>
          import('@edb/feature-erp').then((m) => m.featureERPRoutes),
      },
    ],
  },

  /* 404 page */
  {
    path: 'not-found',
    loadChildren: () =>
      import('@eDB/feature-404').then((m) => m.feature404Routes),
  },
  { path: '**', redirectTo: 'not-found' },
];
