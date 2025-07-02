/* libs/eDB/features/feature-crm/src/lib/feature-crm.routes.ts */
import { Route } from '@angular/router';
import { CrmContactsShellComponent } from './crm-contacts-shell.component';
import { CRMContainer } from './feature-crm.component'; // 👈  new import
import { InvoiceDashboardComponent } from './invoice/invoice-dashboard.component';

export const featureCRMRoutes: Route[] = [
  {
    path: '',
    component: CrmContactsShellComponent,
    children: [
      { path: '', redirectTo: 'contacts', pathMatch: 'full' }, // /crm  → /crm/contacts
      { path: 'contacts', component: CRMContainer }, // /crm/contacts
      { path: 'btw', component: InvoiceDashboardComponent }, // /crm/contacts
      // later:
      // { path: 'reports',  loadComponent: () => … },
      // { path: 'settings', loadComponent: () => … },
    ],
  },
];
