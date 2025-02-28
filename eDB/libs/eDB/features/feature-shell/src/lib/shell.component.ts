import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '@eDB-webshop/client-cart';
import { AuthService } from '@eDB/client-auth';

import {
  UiPlatformHeaderComponent,
  UiPlatformSubHeaderComponent,
  UiPortalFooterComponent,
} from '@eDB/shared-ui';
import { NavigationService } from '@eDB/util-navigation';
import {
  I18nModule,
  NotificationService,
  PlaceholderModule,
} from 'carbon-components-angular';
import { CartComponent } from '../components/test.component';
import { MENU_OPTIONS } from './shell.config';
@Component({
  selector: 'app-shell',
  imports: [
    RouterModule,
    CommonModule,
    PlaceholderModule,
    I18nModule,
    UiPlatformHeaderComponent,
    UiPortalFooterComponent,
    MatButtonModule,
    MatDialogModule,
    UiPlatformSubHeaderComponent,
    CartComponent,
  ],
  providers: [NotificationService],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-gray-100">
      <ui-platform-header
        [navigationLinks]="
          !(isAuthenticated$ | async) || isAdminApp()
            ? []
            : ((navigationService.navigationLinks$ | async) ?? [])
        "
        [menuOptions]="(isAuthenticated$ | async) ? menuOptions : []"
        (linkClick)="navigationService.navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
        [isAdmin]="isAdmin$ | async"
      ></ui-platform-header>

      @if (isWebshopRoute()) {
        <ui-platform-subheader
          (openDialog)="openDialog()"
        ></ui-platform-subheader>
      }

      @if (showCart) {
        <section class="relative z-[200]">
          <app-cart [isCartVisible]="showCart"></app-cart>
        </section>
      }

      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>

      @if (!(isAuthenticated$ | async)) {
        <ui-portal-footer></ui-portal-footer>
      }
    </div>
  `,
})
export class ShellComponent implements OnInit {
  // Services
  navigationService = inject(NavigationService);
  authService = inject(AuthService);
  router = inject(Router);

  // Auth Observables
  isAuthenticated$ = this.authService.isAuthenticated();
  isAdmin$ = this.authService.isAdmin();

  // Signal to determine if this is an admin app
  isAdminApp = signal<boolean>(false);

  // Menu options
  menuOptions = MENU_OPTIONS;

  ngOnInit(): void {
    this.detectAppEnvironment();
  }

  // Detect whether the app is running as admin or web
  private detectAppEnvironment(): void {
    const hostname = window.location.hostname;
    const port = window.location.port;

    if (hostname === 'localhost') {
      // For local development
      this.isAdminApp.set(port === '4300');
    } else {
      // For production/staging
      this.isAdminApp.set(window.location.pathname.startsWith('/admin'));
    }
  }

  // Handle menu options like logout and navigation
  handleMenuOption(optionId: string): void {
    if (optionId === 'logout') {
      this.logout();
    } else {
      this.navigationService.navigateTo(optionId);
    }
  }

  // Logout logic
  private logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  // WEBSHOP

  private dialog = inject(MatDialog);
  protected cartService = inject(CartService);

  showCart = false;

  isWebshopRoute(): boolean {
    return this.router.url.startsWith('/webshop');
  }

  openDialog() {
    // const dialogRef = this.dialog.open(CartDialog);
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
    this.showCart = !this.showCart;
    console.log(this.showCart);
  }

  // this.cartService.getItems().length
}
