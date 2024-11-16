// shell-app/src/app/app.routes.ts
import { Route } from '@angular/router';
import { LoginContainer } from './pages/login/login.container';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    component: LoginContainer,
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },
];
