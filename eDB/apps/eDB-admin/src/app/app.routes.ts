import { provideHttpClient, withFetch } from '@angular/common/http';
import { Route } from '@angular/router';
import { AdminService } from '@eDB/client-admin';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideTanStackQuery(new QueryClient()),
      provideHttpClient(withFetch()),
      AdminService,
    ],
    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
