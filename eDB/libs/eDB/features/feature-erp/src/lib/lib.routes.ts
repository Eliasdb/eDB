import { Route } from '@angular/router';
import { ErpHomeComponent } from './components/erp-home.component';
import { InvoiceDashboardComponent } from './components/invoices-dashboard.component';
import { InvoiceDashboardShellComponent } from './erp.page';

export const featureERPRoutes: Route[] = [
  {
    path: '',
    component: InvoiceDashboardShellComponent,
    children: [
      { path: '', component: ErpHomeComponent },
      { path: 'invoices', component: InvoiceDashboardComponent },
      // { path: 'reports', component: ... },
    ],
  },
];
