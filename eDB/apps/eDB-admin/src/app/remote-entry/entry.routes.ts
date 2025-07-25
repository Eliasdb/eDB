// apps/eDB-admin/src/app/remote-entry/entry.routes.ts
import { RendererFactory2 } from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory2 } from '@angular/platform-browser';
import { Route } from '@angular/router';

export const adminRemoteRoutes: Route[] = [
  {
    path: '',
    providers: [
      // provideClientHydration(),
      // provideAnimations(), // ← optional, but now safe
      { provide: DomRendererFactory2, useExisting: RendererFactory2 },
    ],
    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];

export default adminRemoteRoutes;
