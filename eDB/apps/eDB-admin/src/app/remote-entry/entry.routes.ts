// apps/eDB-admin/src/app/remote-entry/entry.routes.ts
import { provideClientHydration } from '@angular/platform-browser';
import { Route } from '@angular/router';

export const adminRemoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      // importProvidersFrom(BrowserModule), // adds DomRendererFactory2
      // provideAnimations(),
      provideClientHydration(),
    ],
    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];

export default adminRemoteRoutes;
