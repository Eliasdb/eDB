import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KeycloakService } from '@edb/client-auth';
import { UiShellComponent } from '@edb/shared-ui';
import { NavigationService } from '@eDB/util-navigation';
import { MENU_OPTIONS } from './shell.config';

@Component({
  selector: 'ui-shell-host',
  standalone: true,
  imports: [UiShellComponent, CommonModule],
  template: `
    <ui-shell
      [navigationLinks]="(navService.navigationLinks$ | async) ?? []"
      [menuOptions]="keycloak.authState() ? menuOptions : []"
      (linkClick)="navService.navigateTo($event)"
      (menuOptionSelected)="handleMenuOption($event)"
    />
  `,
})
export class UiShellHostComponent {
  navService = inject(NavigationService);
  keycloak = inject(KeycloakService);

  menuOptions = MENU_OPTIONS;

  handleMenuOption(opt: string) {
    if (opt === 'logout') {
      this.keycloak.logout();
    } else {
      this.navService.navigateTo(opt);
    }
  }
}
