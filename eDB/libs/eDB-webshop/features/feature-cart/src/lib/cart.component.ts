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
import { OrderItem } from '@eDB-webshop/shared-types';
import { QuantitySelectorComponent } from '@eDB-webshop/ui-webshop';
import { UiButtonComponent } from '@edb/shared-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, QuantitySelectorComponent],
  animations: [
    trigger('fadeLift', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-0.75rem)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-0.75rem)' }),
        ),
      ]),
    ]),
  ],
  template: `
    @if (isCartVisible()) {
      <!-- Back-drop -->
      <div
        class="fixed inset-0 z-[8999] bg-black/30 backdrop-blur-sm"
        (click)="toggleCart()"
      ></div>

      <!-- Center container -->
      <div
        class="fixed inset-0 z-[9000] flex items-center justify-center px-4"
        (click)="toggleCart()"
      >
        <!-- Panel -->
        <aside
          @fadeLift
          (click)="$event.stopPropagation()"
          class="w-full max-w-5xl rounded-lg bg-[var(--accent)]
                 text-[var(--accent-complimentary)] shadow-xl ring-1 ring-black/5"
        >
          @if (cartItems()?.length) {
            <!-- Desktop table -->
            <div class="hidden md:block max-h-[70vh] overflow-y-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="sticky top-0 bg-[var(--accent)]">
                  <tr class="text-left font-semibold">
                    <th class="px-2 py-1">Cover</th>
                    <th class="px-2 py-1">Details</th>
                    <th class="px-2 py-1 text-center whitespace-nowrap">Qty</th>
                    <th class="px-2 py-1 text-right">Price</th>
                    <th class="px-2 py-1"></th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">
                  @for (item of cartItems(); track item.id) {
                    <tr class="hover:bg-black/5 align-middle">
                      <!-- Cover -->
                      <td class="px-2 py-1 align-middle">
                        <img
                          [src]="item.book.photoUrl"
                          [alt]="item.book.title"
                          class="h-24 w-auto rounded-md object-cover shadow-sm"
                        />
                      </td>

                      <!-- Details -->
                      <td class="px-2 py-1 max-w-sm leading-snug align-middle">
                        <p class="font-semibold">{{ item.book.title }}</p>
                        <p class="text-xs opacity-70">
                          {{ item.book.author }} • {{ item.book.publishedDate }}
                        </p>
                        <p class="text-xs opacity-60">
                          Genre: {{ item.book.genre }}
                        </p>
                      </td>

                      <!-- Quantity -->
                      <td class="px-2 py-1 text-center align-middle">
                        <ui-webshop-quantity-selector
                          [max]="item.book.stock"
                          (quantityChange)="updateQuantity(item.id, $event)"
                        ></ui-webshop-quantity-selector>
                      </td>

                      <!-- Price -->
                      <td
                        class="px-2 py-1 text-right whitespace-nowrap align-middle"
                      >
                        {{
                          item.book.price * item.selectedAmount
                            | currency: 'EUR' : 'symbol'
                        }}
                      </td>

                      <!-- Remove -->
                      <td class="px-2 py-1 text-right align-middle">
                        <ui-button
                          size="sm"
                          variant="ghost"
                          (buttonClick)="removeItem(item.id)"
                        >
                          ✕
                        </ui-button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Mobile cards (unchanged) -->
            <div class="md:hidden max-h-[70vh] space-y-3 overflow-y-auto p-4">
              <!-- Replace <tbody> block: -->
              @for (item of cartItems(); track item.id) {
                <div class="flex items-center gap-6 py-3 px-4 hover:bg-black/5">
                  <!-- Cover -->
                  <img
                    [src]="item.book.photoUrl"
                    [alt]="item.book.title"
                    class="h-24 w-auto rounded-md object-cover shadow-sm flex-shrink-0"
                  />

                  <!-- Details grows -->
                  <div class="flex-1">
                    <p class="font-semibold leading-tight">
                      {{ item.book.title }}
                    </p>
                    <p class="text-xs opacity-70 leading-tight">
                      {{ item.book.author }} • {{ item.book.publishedDate }}
                    </p>
                    <p class="text-xs opacity-60 leading-tight">
                      Genre: {{ item.book.genre }}
                    </p>
                  </div>

                  <!-- Qty -->
                  <div class="w-28 text-center">
                    <ui-webshop-quantity-selector
                      [max]="item.book.stock"
                      (quantityChange)="updateQuantity(item.id, $event)"
                    ></ui-webshop-quantity-selector>
                  </div>

                  <!-- Price -->
                  <div class="w-24 text-right font-medium whitespace-nowrap">
                    {{
                      item.book.price * item.selectedAmount
                        | currency: 'EUR' : 'symbol'
                    }}
                  </div>

                  <!-- Remove -->
                  <ui-button
                    size="sm"
                    variant="ghost"
                    (buttonClick)="removeItem(item.id)"
                    class="ml-2"
                    >✕</ui-button
                  >
                </div>
              }
            </div>

            <!-- Summary -->
            <div
              class="flex flex-col items-end gap-4 border-t border-gray-200
                     bg-[var(--accent)] px-6 py-3
                     md:flex-row md:items-center md:justify-end"
            >
              <div class="text-lg font-semibold">
                Total: {{ totalPrice() | currency: 'EUR' : 'symbol' }}
              </div>
              <ui-button size="sm" (buttonClick)="proceedToCheckout()">
                Proceed to checkout
              </ui-button>
            </div>
          } @else {
            <p class="p-8 text-center text-sm opacity-70">
              Your cart is empty… fill it 🛒
            </p>
          }
        </aside>
      </div>
    }
  `,
})
export class CartComponent implements OnInit, OnDestroy {
  /* Inputs / Outputs */
  readonly cartItems = input<OrderItem[]>();
  readonly isCartVisible = input<boolean>(false);

  @Output() showCart = new EventEmitter<void>();
  @Output() cartItemDeleted = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<{
    id: number;
    quantity: number;
  }>();
  @Output() checkoutClicked = new EventEmitter<void>();

  /* Internal */
  private sub = new Subscription();
  isMobile = false;

  constructor(private bo: BreakpointObserver) {}

  ngOnInit() {
    this.sub = this.bo
      .observe('(max-width: 768px)')
      .subscribe((r) => (this.isMobile = r.matches));
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /* Handlers */
  toggleCart() {
    this.showCart.emit();
  }
  removeItem(id: number) {
    this.cartItemDeleted.emit(id);
  }
  updateQuantity(id: number, qty: number) {
    this.quantityChanged.emit({ id, quantity: qty });
  }
  proceedToCheckout() {
    this.checkoutClicked.emit();
  }

  /* Helper */
  totalPrice(): number {
    return (
      this.cartItems()?.reduce(
        (sum, it) => sum + it.book.price * it.selectedAmount,
        0,
      ) ?? 0
    );
  }
}
