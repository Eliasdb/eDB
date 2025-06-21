import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KeycloakService } from '@eDB/client-auth';
import { NavigationService } from '@eDB/util-navigation';
import { UiShellComponent } from './shell.component';
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

  handleMenuOption(optionId: string) {
    if (optionId === 'logout') {
      // Navigate *first* to avoid guarding issues on /logout
      this.navService.navigateTo('/').then(() => this.keycloak.logout());
    } else {
      this.navService.navigateTo(optionId);
    }
  }
}
