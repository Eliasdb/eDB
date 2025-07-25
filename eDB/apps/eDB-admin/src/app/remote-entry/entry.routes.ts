// apps/eDB-admin/src/app/remote-entry/entry.routes.ts
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Route } from '@angular/router';

export const adminRemoteRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    providers: [
      importProvidersFrom(BrowserModule), // adds DomRendererFactory2
      provideAnimations(),
    ],
    loadChildren: () =>
      import('@eDB/feature-admin-dashboard').then(
        (m) => m.featureAdminDashboardRoutes,
      ),
  },
  { path: '**', redirectTo: 'not-found' },
];

/* 🔑  default export */
export default adminRemoteRoutes;
