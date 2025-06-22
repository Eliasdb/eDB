import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Route } from '@angular/router';
import { AdminService } from '@eDB/client-admin';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  DropdownModule,
  I18nModule,
  ModalModule,
} from 'carbon-components-angular';

export const remoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideTanStackQuery(new QueryClient()),
      provideHttpClient(withFetch()),
      AdminService,
      provideAnimations(),
      importProvidersFrom(I18nModule, ModalModule, DropdownModule),
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
