import { Route } from '@angular/router';
import { CrmHomeComponent } from './components/crm-home.component';
import { CrmContactsShellComponent } from './components/shell/crm-contacts-shell.component';
import { CRMContainer } from './feature-crm.container';

export const featureCRMRoutes: Route[] = [
  {
    path: '',
    component: CrmContactsShellComponent,
    children: [
      { path: '', component: CrmHomeComponent }, // ⬅️ default /crm
      { path: 'contacts', component: CRMContainer },
      // { path: 'settings', loadComponent: () => import('./...').then(m => m.YourSettingsComponent) }, // optional
      // { path: 'reports', loadComponent: () => import('./...').then(m => m.ReportsComponent) }, // optional
    ],
  },
];
