import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { OrderItem } from '@eDB-webshop/shared-types';
import { UiButtonComponent } from '@eDB/shared-ui';

import { StructuredListModule } from 'carbon-components-angular';

@Component({
  selector: 'app-cart',
  imports: [StructuredListModule, UiButtonComponent],
  template: `
    <div @slideAnimation class="cart-container">
      <section class="cart">
        <cds-structured-list>
          <cds-list-header>
            <cds-list-column>Cover</cds-list-column>
            <cds-list-column>Details</cds-list-column>
            <cds-list-column>Amount</cds-list-column>
            <cds-list-column>Price</cds-list-column>
            <cds-list-column>Remove</cds-list-column>
          </cds-list-header>
          @for (cartItem of cartItems(); track $index) {
            <cds-list-row>
              <cds-list-column>
                <img
                  [src]="cartItem.book.photoUrl"
                  [alt]="cartItem.book.title"
                  style="width: 150px; height: auto;"
                />
              </cds-list-column>
              <cds-list-column>
                <div>
                  <strong>{{ cartItem.book.title }}</strong>
                </div>
                <div>Author: {{ cartItem.book.author }}</div>
                <div>Year: {{ cartItem.book.publishedDate }}</div>
                <div>Genre: {{ cartItem.book.genre }}</div>
              </cds-list-column>
              <cds-list-column>
                {{ cartItem.selectedAmount }}
              </cds-list-column>
              <cds-list-column>
                {{ cartItem.book.price }}
              </cds-list-column>
              <cds-list-column>
                <ui-button size="sm" (buttonClick)="removeItem(cartItem.id)"
                  >Remove</ui-button
                >
              </cds-list-column>
            </cds-list-row>
          }
        </cds-structured-list>
        <section class="button">
          <ui-button size="sm" (buttonClick)="toggleCart()"
            >Proceed to checkout</ui-button
          >
        </section>
      </section>
    </div>
  `,
  styleUrl: 'cart.component.scss',
  animations: [
    trigger('slideAnimation', [
      // On enter: start off-screen above and slide down into view.
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      // On leave: ensure starting at position and slide up out of view.
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class CartComponent {
  readonly cartItems = input<OrderItem[]>();
  readonly isCartVisible = input<boolean>(false);

  @Output() showCart = new EventEmitter<Event>();
  @Output() cartItemDeleted = new EventEmitter<number>();

  toggleCart() {
    this.showCart.emit();
  }

  removeItem(cartItemId: number) {
    this.cartItemDeleted.emit(cartItemId);
  }
}
