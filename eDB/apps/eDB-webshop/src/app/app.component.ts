import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from '@eDB-webshop/client-cart';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent implements OnInit {
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.setCart();
  }

  setCart() {
    const cartString = localStorage.getItem('cart');
    if (!cartString) return;
    const cart: Book[] = JSON.parse(cartString);
    this.cartService.setCurrentCart(cart);
  }
}
