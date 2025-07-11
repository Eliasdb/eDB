import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { CartService } from '@eDB-webshop/client-cart';
import { CartComponent } from '@eDB-webshop/feature-cart';
import { UiPlatformSubHeaderComponent } from './sub-header.component';

@Component({
  selector: 'edb-webshop-root',
  imports: [RouterOutlet, CartComponent, UiPlatformSubHeaderComponent],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-[#dae4f2]">
      <ui-platform-subheader
        (openDialog)="toggleCart()"
        [cartItems]="cartItems()"
        [orderItems]="cartItems()"
        (ordersClick)="goToOrders()"
      ></ui-platform-subheader>

      @if (showCart) {
        <section class="relative">
          <app-cart
            [cartItems]="cartItems()"
            [isCartVisible]="showCart"
            (showCart)="showCart = false"
            (cartItemDeleted)="onDeleteCartItem($event)"
            (checkoutClicked)="goToCheckout()"
          ></app-cart>
        </section>
      }

      <main class="platform-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class WebshopAppComponent {
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

  goToCheckout() {
    this.showCart = false;
    this.router.navigate(['/webshop/checkout']);
  }

  goToOrders() {
    this.router.navigate(['/webshop/orders']);
  }
}
