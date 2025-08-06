import { Component, signal } from '@angular/core';
import { UiSidebarLayoutSmarterComponent } from '@edb/shared-ui';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'crm-contacts-shell',
  imports: [UiSidebarLayoutSmarterComponent],
  template: `
    <ui-sidebar-layout
      [brandTitle]="'eDB'"
      [brandSubtitle]="'CRM'"
      [pageTitle]="'Contacts'"
      [items]="crmMenu()"
    />
  `,
})
export class CrmContactsShellComponent {
  readonly crmMenu = signal<NavItem[]>([
    {
      id: 'home',
      label: 'Home',
      route: '/crm',
      icon: 'home',
    },
    {
      id: 'contacts',
      label: 'Companies & Contacts',
      route: 'contacts',
      icon: 'people',
    },
  ]);
}
