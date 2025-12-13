import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { AuthGuard } from './guards/auth.guard';
import { WrapperComponent } from './wrappers/wc-wrapper/wrapReact';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      /* Host app routes */
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
          loadRemote<{ default: Route[] }>('mfe-edb-admin/Routes').then(
            (m) => m?.default ?? [],
          ),
      },

      // ...(environment.mfEnableRemotes
      //   ? [
      //       {
      //         path: 'admin',
      //         loadChildren: () =>
      //           loadRemote<{ default: Route[] }>('mfe-edb-admin/Routes').then(
      //             (m) => m!.default,
      //           ),
      //       },
      //     ]
      //   : []),

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
        path: 'izmir',
        loadChildren: () =>
          import('@eDB/feature-izmir').then((m) => m.featureIzmirRoutes),
      },
      {
        path: 'erp',
        loadChildren: () =>
          import('@edb/feature-erp').then((m) => m.featureERPRoutes),
      },

      {
        path: 'clara',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./wrappers/iframe-wrapper/iframe-wrapper.component').then(
            (m) => m.IframeWrapperComponent,
          ),
      },

      /* 🔧 Agent playground */
      {
        path: 'workbench',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./wrappers/agent-playground/agent-playground.component').then(
            (m) => m.AgentPlaygroundComponent,
          ),
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
