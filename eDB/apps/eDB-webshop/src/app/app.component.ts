import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CartService } from '@eDB-webshop/client-cart';
import { CartComponent } from '@eDB-webshop/feature-cart';
import { UiPlatformSubHeaderComponent } from '@eDB/shared-ui';
import { I18nModule, PlaceholderModule } from 'carbon-components-angular';

@Component({
  selector: 'app-webshop-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PlaceholderModule,
    I18nModule,
    UiPlatformSubHeaderComponent,
    MatButtonModule,
    MatDialogModule,
    CartComponent,
  ],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-gray-100">
      <ui-platform-subheader
        (openDialog)="toggleCart()"
        [cartItems]="cartItems()"
      ></ui-platform-subheader>

      @if (showCart) {
        <section class="relative z-[200]">
          <app-cart
            (cartItemDeleted)="onDeleteCartItem($event)"
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
export class AppComponent {
  protected router = inject(Router);
  protected cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  showCart = false;

  toggleCart() {
    this.showCart = !this.showCart;
    console.log('toggle', `${this.showCart}`);
  }

  onDeleteCartItem(cartItemId: number) {
    this.cartService.removeFromCart(cartItemId);
  }
}
