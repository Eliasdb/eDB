import { Route } from '@angular/router';
import { PlatformLayoutComponent } from './layouts/platform/platform-layout.component';
import { PortalLayoutComponent } from './layouts/portal/portal-layout.component';
import { LoginContainer } from './pages/portal/login/login.container';
import { RegisterContainer } from './pages/portal/register/register.container';

export const routes: Route[] = [
  {
    path: '', // Platform routes with shared layout
    component: PlatformLayoutComponent,
    children: [
      {
        path: '', // Default platform home page
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },
  {
    path: 'auth', // Authentication routes with PortalLayoutComponent
    component: PortalLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginContainer,
      },
      {
        path: 'register',
        component: RegisterContainer,
      },
    ],
  },
  {
    path: 'appointments', // Appointments route with no shared layout
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },
  {
    path: '**',
    redirectTo: '', // Redirect unknown paths to the default route
  },
];
