import { animate, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderItem } from '@eDB-webshop/shared-types';
import { QuantitySelectorComponent } from '@eDB-webshop/ui-webshop';
import { UiButtonComponent } from '@eDB/shared-ui';
import { StructuredListModule } from 'carbon-components-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [
    StructuredListModule,
    UiButtonComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    QuantitySelectorComponent,
  ],
  template: `
    <!-- Desktop View -->
    <div
      @slideAnimation
      class="fixed top-32 left-0 w-screen bg-[#F5F5F5] max-h-[30rem] overflow-y-auto shadow-md z-[9000] p-4 py-1"
    >
      @if (!isMobile) {
        <section class="cart">
          <cds-structured-list>
            <cds-list-header>
              <cds-list-column>Cover</cds-list-column>
              <cds-list-column>Details</cds-list-column>
              <cds-list-column>Quantity</cds-list-column>
              <cds-list-column>Price</cds-list-column>
              <cds-list-column>Remove</cds-list-column>
            </cds-list-header>
            @for (cartItem of cartItems(); track $index) {
              <cds-list-row>
                <cds-list-column class="p-4">
                  <img
                    [src]="cartItem.book.photoUrl"
                    [alt]="cartItem.book.title"
                    class="w-[100px] h-auto"
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
                  <app-quantity-selector
                    [max]="cartItem.book.stock"
                    (quantityChange)="updateQuantity(cartItem.id, $event)"
                  ></app-quantity-selector>
                </cds-list-column>
                <cds-list-column>
                  {{
                    cartItem.book.price * cartItem.selectedAmount
                      | currency: 'EUR' : 'symbol'
                  }}
                </cds-list-column>
                <cds-list-column>
                  <ui-button size="sm" (buttonClick)="removeItem(cartItem.id)">
                    Remove
                  </ui-button>
                </cds-list-column>
              </cds-list-row>
            }
          </cds-structured-list>
          <section class="flex justify-end mr-8">
            <section
              class="flex flex-col gap-4 border-2 border-solid border-gray-300 p-4 rounded-[0.25rem] my-8"
            >
              <section class="flex flex-col">
                <h3>Total</h3>
                <span>{{ totalPrice() | currency: 'EUR' : 'symbol' }}</span>
              </section>
              <ui-button size="sm" (buttonClick)="toggleCart()">
                Proceed to checkout
              </ui-button>
            </section>
          </section>
        </section>
      } @else {
        @if (cartItems()?.length) {
          @for (cartItem of cartItems(); track $index) {
            <div
              class="relative border border-solid p-4 bg-[#DBDBDB] rounded-[0.25rem] mt-4"
            >
              <!-- Floating Action Button positioned in the top right -->
              <div class="absolute top-2 right-2 scale-[0.6]">
                <button mat-mini-fab (click)="removeItem(cartItem.id)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <div class="flex items-end">
                <img
                  [src]="cartItem.book.photoUrl"
                  [alt]="cartItem.book.title"
                  class="w-24 h-auto mr-4"
                />
                <div class="max-w-[9rem]">
                  <h4 class="font-bold text-base  mb-4">
                    {{ cartItem.book.title }}
                  </h4>
                  <div class="flex flex-col gap-2">
                    <div>
                      <p class="text-sm font-semibold m-0 ">Author</p>
                      <span class="text-sm text-gray-600">{{
                        cartItem.book.author
                      }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-semibold m-0">Year</p>
                      <span class="text-sm text-gray-600">{{
                        cartItem.book.publishedDate
                      }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-semibold m-0">Genre</p>
                      <span class="text-sm text-gray-600">{{
                        cartItem.book.genre
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <app-quantity-selector
                  [max]="cartItem.book.stock"
                  (quantityChange)="updateQuantity(cartItem.id, $event)"
                ></app-quantity-selector>
                <span class="text-sm font-semibold">
                  {{
                    cartItem.book.price * cartItem.selectedAmount
                      | currency: 'EUR' : 'symbol'
                  }}
                </span>
              </div>
            </div>
          }
          <div class="border-t p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Total</h3>
              <span class="text-lg font-semibold">
                {{ totalPrice() | currency: 'EUR' : 'symbol' }}
              </span>
            </div>
            <div class="flex justify-end">
              <ui-button size="sm" (buttonClick)="toggleCart()">
                Proceed to checkout
              </ui-button>
            </div>
          </div>
        } @else {
          <p class="text-center py-2">Your cart is empty... Fill it! 🛒</p>
        }
      }
    </div>
    <!-- Mobile View -->
  `,
  styleUrls: ['cart.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class CartComponent implements OnInit, OnDestroy {
  readonly cartItems = input<OrderItem[]>();
  readonly isCartVisible = input<boolean>(false);

  @Output() showCart = new EventEmitter<Event>();
  @Output() cartItemDeleted = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<{
    id: number;
    quantity: number;
  }>();

  isMobile: boolean = false;
  private breakpointSub: Subscription = new Subscription();

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointSub = this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy() {
    if (this.breakpointSub) {
      this.breakpointSub.unsubscribe();
    }
  }

  toggleCart() {
    this.showCart.emit();
  }

  removeItem(cartItemId: number) {
    this.cartItemDeleted.emit(cartItemId);
  }

  updateQuantity(cartItemId: number, newQuantity: number) {
    // Update the selectedAmount for the specific cart item.
    const items = this.cartItems();
    const item = items?.find((i) => i.id === cartItemId);
    if (item) {
      item.selectedAmount = newQuantity;
    }
    this.quantityChanged.emit({ id: cartItemId, quantity: newQuantity });
  }

  totalPrice(): number {
    return (
      this.cartItems()?.reduce(
        (acc, item) => acc + item.book.price * item.selectedAmount,
        0,
      ) || 0
    );
  }
}
