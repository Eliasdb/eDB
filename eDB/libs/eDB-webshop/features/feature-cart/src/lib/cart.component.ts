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

      <!-- Wrapper allows vertical scroll on mobile -->
      <div
        class="fixed inset-0 z-[9000] flex flex-col items-start md:items-center justify-start md:justify-center overflow-y-auto"
        (click)="toggleCart()"
      >
        <aside
          @fadeLift
          (click)="$event.stopPropagation()"
          class="w-full max-w-5xl md:max-h-[90vh] bg-[var(--accent)] text-[var(--accent-complimentary)] shadow-xl ring-1 ring-black/5 rounded-lg flex flex-col overflow-hidden self-center"
        >
          <!-- Header with title / close -->
          <header
            class="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[var(--accent)] z-10"
          >
            <h2 class="text-lg font-semibold">Your Cart</h2>
            <ui-button size="sm" variant="ghost" (buttonClick)="toggleCart()"
              >✕</ui-button
            >
          </header>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">
            @if (cartItems()?.length) {
              <!-- DESKTOP GRID-LIST (replaces table) -->
              <div class="hidden md:block">
                <!-- header row -->
                <div
                  class="grid grid-cols-[120px_1fr_112px_112px_40px] gap-4 px-6 py-2 font-semibold text-sm sticky bg-[var(--accent)] z-5"
                >
                  <span>Cover</span>
                  <span>Details</span>
                  <span class="text-center">Qty</span>
                  <span class="text-right">Price</span>
                  <span></span>
                </div>

                <!-- item rows -->
                @for (item of cartItems(); track item.id) {
                  <div
                    class="grid grid-cols-[120px_1fr_112px_112px_40px] gap-4 px-6 py-4 items-center border-t border-white/5 hover:bg-black/5"
                  >
                    <!-- cover -->
                    <div>
                      <img
                        [src]="item.book.photoUrl"
                        [alt]="item.book.title"
                        class="h-24 w-auto rounded-md object-cover"
                      />
                    </div>

                    <!-- details -->
                    <div class="leading-snug max-w-md">
                      <p class="font-semibold">{{ item.book.title }}</p>
                      <p class="text-xs opacity-70">
                        {{ item.book.author }} • {{ item.book.publishedDate }}
                      </p>
                      <p class="text-xs opacity-60">
                        Genre: {{ item.book.genre }}
                      </p>
                    </div>

                    <!-- qty selector -->
                    <div class="justify-self-center">
                      <ui-webshop-quantity-selector
                        [max]="item.book.stock"
                        (quantityChange)="updateQuantity(item.id, $event)"
                      ></ui-webshop-quantity-selector>
                    </div>

                    <!-- price -->
                    <div class="text-right whitespace-nowrap font-medium">
                      {{
                        item.book.price * item.selectedAmount
                          | currency: 'EUR' : 'symbol'
                      }}
                    </div>

                    <!-- remove -->
                    <ui-button
                      size="sm"
                      variant="ghost"
                      (buttonClick)="removeItem(item.id)"
                      >✕</ui-button
                    >
                  </div>
                }
              </div>

              <!-- MOBILE CARDS -->
              <div class="md:hidden p-4 space-y-4">
                @for (item of cartItems(); track item.id) {
                  <div
                    class="rounded-lg bg-white/10 p-4 flex flex-col gap-3 shadow hover:shadow-md transition-shadow duration-200"
                  >
                    <div class="flex gap-4">
                      <img
                        [src]="item.book.photoUrl"
                        [alt]="item.book.title"
                        class="h-24 w-16 rounded-md object-cover flex-shrink-0"
                      />
                      <div class="flex-1 flex flex-col gap-[2px]">
                        <p class="font-semibold text-sm leading-tight">
                          {{ item.book.title }}
                        </p>
                        <p class="text-xs opacity-70 leading-tight">
                          {{ item.book.author }} • {{ item.book.publishedDate }}
                        </p>
                        <p class="text-xs opacity-60 leading-tight">
                          Genre: {{ item.book.genre }}
                        </p>
                      </div>
                      <ui-button
                        size="sm"
                        variant="ghost"
                        (buttonClick)="removeItem(item.id)"
                        >✕</ui-button
                      >
                    </div>
                    <div
                      class="flex items-center justify-between pt-2 border-t border-white/10"
                    >
                      <ui-webshop-quantity-selector
                        [max]="item.book.stock"
                        (quantityChange)="updateQuantity(item.id, $event)"
                      ></ui-webshop-quantity-selector>
                      <div class="font-medium text-sm">
                        {{
                          item.book.price * item.selectedAmount
                            | currency: 'EUR' : 'symbol'
                        }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="p-8 text-center text-sm opacity-70">
                Your cart is empty… fill it 🛒
              </p>
            }
          </div>

          <!-- Footer summary -->
          @if (cartItems()?.length) {
            <footer
              class="flex flex-col items-end gap-4 border-t border-gray-200 bg-[var(--accent)] px-6 py-3 md:flex-row md:items-center md:justify-end"
            >
              <div class="text-lg font-semibold">
                Total: {{ totalPrice() | currency: 'EUR' : 'symbol' }}
              </div>
              <ui-button size="sm" (buttonClick)="proceedToCheckout()"
                >Proceed to checkout</ui-button
              >
            </footer>
          }
        </aside>
      </div>
    }
  `,
})
export class CartComponent implements OnInit, OnDestroy {
  readonly cartItems = input<OrderItem[]>();
  readonly isCartVisible = input<boolean>(false);

  @Output() showCart = new EventEmitter<void>();
  @Output() cartItemDeleted = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<{
    id: number;
    quantity: number;
  }>();
  @Output() checkoutClicked = new EventEmitter<void>();

  private sub = new Subscription();

  constructor(private bo: BreakpointObserver) {}

  ngOnInit() {
    this.sub = this.bo.observe('(max-width: 768px)').subscribe();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

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

  totalPrice(): number {
    return (
      this.cartItems()?.reduce(
        (sum, it) => sum + it.book.price * it.selectedAmount,
        0,
      ) ?? 0
    );
  }
}
