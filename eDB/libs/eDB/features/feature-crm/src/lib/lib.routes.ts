/* libs/eDB/features/feature-crm/src/lib/feature-crm.routes.ts */
import { Route } from '@angular/router';
import { CrmContactsShellComponent } from './crm-contacts-shell.component';
import { CRMContainer } from './feature-crm.component'; // 👈  new import

export const featureCRMRoutes: Route[] = [
  {
    path: '',
    component: CrmContactsShellComponent,
    children: [
      { path: '', redirectTo: 'contacts', pathMatch: 'full' }, // /crm  → /crm/contacts
      { path: 'contacts', component: CRMContainer }, // /crm/contacts
      // later:
      // { path: 'reports',  loadComponent: () => … },
      // { path: 'settings', loadComponent: () => … },
    ],
  },
];
