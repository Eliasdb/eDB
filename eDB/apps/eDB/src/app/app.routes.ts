// shell-app/src/app/app.routes.ts
import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },
];
