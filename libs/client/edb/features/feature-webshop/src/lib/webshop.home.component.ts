// webshop-app.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CartService } from '@edb/client-cart';
import { OrderService } from '@edb/client-orders';
import {
  AiModeCatalogComponent,
  AiSearchService,
} from '@edb/feature-webshop-aimode';
import { CartComponent } from '@edb/feature-webshop-cart';
import { UiPlatformSubHeaderComponent } from './sub-header.component';

@Component({
  selector: 'edb-webshop-root',
  imports: [
    RouterOutlet,
    CartComponent,
    UiPlatformSubHeaderComponent,
    AiModeCatalogComponent,
  ],
  template: `
    <div class="flex flex-col min-h-[100dvh] bg-[#f4f4f7]">
      <webshop-subheader
        (openDialog)="toggleCart()"
        [cartItems]="cartItems()"
        [orderCount]="orderCount()"
        (ordersClick)="goToOrders()"
        (aiToggleClick)="toggleAiView()"
      />

      @if (showCart) {
        <section class="relative">
          <app-cart
            [cartItems]="cartItems()"
            [isCartVisible]="showCart"
            (showCart)="showCart = false"
            (cartItemDeleted)="onDeleteCartItem($event)"
            (checkoutClicked)="goToCheckout()"
          />
        </section>
      }

      <main class="platform-content">
        @if (aiView()) {
          <ai-mode-catalog [onClose]="toggleAiView" />
        } @else {
          <router-outlet />
        }
      </main>
    </div>
  `,
})
export class WebshopAppComponent {
  private router = inject(Router);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private aiSvc = inject(AiSearchService);

  cartItems = this.cartService.cartItems;
  orderCount = this.orderService.orderCount;

  showCart = false;
  private _aiView = signal(false);
  aiView = this._aiView.asReadonly();

  toggleCart = () => (this.showCart = !this.showCart);

  toggleAiView = () => {
    const next = !this._aiView();
    this._aiView.set(next);
    if (next) {
      // optional: seed with last typed search or a blank
      this.aiSvc.run(this.aiSvc.nlQuery() || 'drama books');
    }
  };

  onDeleteCartItem(id: number) {
    this.cartService.removeFromCart(id);
  }
  goToCheckout() {
    this.showCart = false;
    this.router.navigate(['/webshop/checkout']);
  }
  goToOrders() {
    this.router.navigate(['/webshop/orders']);
  }
}
