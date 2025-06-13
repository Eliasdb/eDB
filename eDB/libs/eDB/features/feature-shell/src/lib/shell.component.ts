import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { KeycloakService } from '@eDB/client-auth';
import { NavigationService } from '@eDB/util-navigation';

import { UiPlatformHeaderComponent } from '@eDB/shared-ui';

import {
  I18nModule,
  NotificationService,
  PlaceholderModule,
} from 'carbon-components-angular';

import { environment } from '@eDB/shared-env';
import { MENU_OPTIONS } from './shell.config';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    PlaceholderModule,
    I18nModule,
    UiPlatformHeaderComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [NotificationService],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-white">
      <ui-platform-header
        [navigationLinks]="
          !isAuthenticated() || isAdminApp()
            ? []
            : ((navigationService.navigationLinks$ | async) ?? [])
        "
        [menuOptions]="isAuthenticated() ? menuOptions : []"
        (linkClick)="navigationService.navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
      ></ui-platform-header>

      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>
    </div>
  `,
})
export class ShellComponent implements OnInit {
  navigationService = inject(NavigationService);
  keycloakService = inject(KeycloakService);
  router = inject(Router);

  isAuthenticated = this.keycloakService.authState;
  isAdminApp = signal<boolean>(false);

  menuOptions = MENU_OPTIONS;

  ngOnInit(): void {
    this.detectAppEnvironment();
  }

  private detectAppEnvironment(): void {
    const isAdmin = window.location.pathname.startsWith('/admin');
    this.isAdminApp.set(isAdmin);
  }

  handleMenuOption(optionId: string): void {
    if (optionId === 'logout') {
      this.logout();
    } else if (optionId === 'profile') {
      window.location.assign(environment.KC.account);
    } else {
      this.navigationService.navigateTo(optionId);
    }
  }

  private logout(): void {
    this.keycloakService.logout();
    this.router.navigate(['/']);
  }
}
