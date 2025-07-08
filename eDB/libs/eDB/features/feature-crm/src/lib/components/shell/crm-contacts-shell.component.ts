import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, UiSidebarLayoutSmarterComponent],
  template: `
    <ui-sidebar-layout-2
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
