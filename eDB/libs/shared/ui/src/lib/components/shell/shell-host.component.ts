import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '@eDB/client-auth';
import { environment } from '@eDB/shared-env';
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
  router = inject(Router);

  menuOptions = MENU_OPTIONS;

  handleMenuOption(optionId: string) {
    if (optionId === 'logout') {
      this.keycloak.logout();
      this.router.navigate(['/']);
    } else if (optionId === 'profile') {
      window.location.assign(environment.KC.account);
    } else {
      this.navService.navigateTo(optionId);
    }
  }
}
