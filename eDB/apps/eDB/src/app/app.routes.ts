import { Route } from '@angular/router';
import { PlatformLayout } from './layouts/platform/platform.layout';
import { PortalLayout } from './layouts/portal/portal.layout';
import { LoginContainer } from './pages/portal/login/login.container';
import { RegisterContainer } from './pages/portal/register/register.container';

export const routes: Route[] = [
  {
    path: '',
    component: PlatformLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/platform/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/platform/profile/profile.container').then(
            (m) => m.ProfileContainer
          ),
      },

      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/platform/admin/admin.container').then(
            (m) => m.AdminContainer
          ),
      },
    ],
  },
  {
    path: 'auth',
    component: PortalLayout,
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
    path: 'appointments',
    loadChildren: () =>
      import('@eDB/appointment-app').then((m) => m.AppointmentsModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
