import { Component, signal } from '@angular/core';
import { UiSidebarLayoutSmarterComponent } from '@edb/shared-ui';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'edb-erp-invoices-shell',
  imports: [UiSidebarLayoutSmarterComponent],
  template: `
    <ui-sidebar-layout
      [brandTitle]="'eDB'"
      [brandSubtitle]="'ERP'"
      [pageTitle]="'Invoices'"
      [items]="erpMenu()"
    />
  `,
})
export class InvoiceDashboardShellComponent {
  readonly erpMenu = signal<NavItem[]>([
    {
      id: 'home',
      label: 'Home',
      route: '/erp',
      icon: 'home',
    },
    {
      id: 'invoices',
      label: 'Accounting',
      route: 'invoices',
      icon: 'receipt_long',
    },
    {
      id: 'reports',
      label: 'Reports',
      route: 'reports',
      icon: 'bar_chart',
    },
  ]);
}
