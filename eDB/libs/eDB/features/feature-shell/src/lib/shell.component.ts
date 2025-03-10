import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CartService } from '@eDB-webshop/client-cart';
import { KeycloakService } from '@eDB/client-auth';
import { NavigationService } from '@eDB/util-navigation';

import { CartComponent } from '@eDB-webshop/feature-cart';
import {
  UiPlatformHeaderComponent,
  UiPlatformSubHeaderComponent,
} from '@eDB/shared-ui';

import {
  I18nModule,
  NotificationService,
  PlaceholderModule,
} from 'carbon-components-angular';

import { environment } from '@eDB/shared-env';
import { MENU_OPTIONS } from './shell.config';
@Component({
  selector: 'app-shell',
  imports: [
    RouterModule,
    CommonModule,
    PlaceholderModule,
    I18nModule,
    UiPlatformHeaderComponent,
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
          !isAuthenticated() || isAdminApp()
            ? []
            : ((navigationService.navigationLinks$ | async) ?? [])
        "
        [menuOptions]="isAuthenticated() ? menuOptions : []"
        (linkClick)="navigationService.navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
      ></ui-platform-header>

      @if (isWebshopRoute()) {
        <ui-platform-subheader
          (openDialog)="onShowCart()"
          [cartItems]="cartItems()"
        ></ui-platform-subheader>
      }

      @if (showCart) {
        <section class="relative z-[200]">
          <app-cart
            (cartItemDeleted)="onDeleteCartItem($event)"
            [isCartVisible]="showCart"
            [cartItems]="cartItems()"
          ></app-cart>
        </section>
      }

      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>
    </div>
  `,
})
export class ShellComponent implements OnInit {
  // Services
  navigationService = inject(NavigationService);
  keycloakService = inject(KeycloakService);
  router = inject(Router);

  // Auth Observables
  isAuthenticated = this.keycloakService.authState;
  // isAdmin$ = this.authService.isAdmin();

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
    }

    if (optionId === 'profile') {
      window.open(`${environment.KC.account}`, '_blank');
    } else {
      this.navigationService.navigateTo(optionId);
    }
  }

  // Logout logic
  private logout(): void {
    this.keycloakService.logout();
    this.router.navigate(['/']);
  }

  // WEBSHOP

  protected cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  showCart = false;

  isWebshopRoute(): boolean {
    return this.router.url.startsWith('/webshop');
  }

  onShowCart() {
    this.showCart = !this.showCart;
  }

  onDeleteCartItem(cartItemId: number) {
    this.cartService.removeFromCart(cartItemId);
  }
}
