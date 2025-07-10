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
import { CartItem } from '@eDB-webshop/shared-types';
import { UiButtonComponent, UiIconButtonComponent } from '@edb/shared-ui';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, UiIconButtonComponent, UiButtonComponent],
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

      <!-- Wrapper (scrollable on mobile) -->
      <div
        class="fixed inset-0 z-[9000] flex flex-col items-start md:items-center
                  justify-start md:justify-center overflow-y-auto"
        (click)="toggleCart()"
      >
        <aside
          @fadeLift
          (click)="$event.stopPropagation()"
          class="w-full max-w-5xl md:max-h-[90vh] bg-[var(--accent)]
                      text-[var(--accent-complimentary)] shadow-xl ring-1 ring-black/5
                      rounded-lg flex flex-col overflow-hidden self-center"
        >
          <!-- Header -->
          <header
            class="flex items-center justify-between px-6 py-4 border-b border-white
                   sticky top-0 bg-[var(--accent)] z-10"
          >
            <h2 class="text-lg font-semibold">Your Cart</h2>
            <ui-button size="sm" variant="ghost" (buttonClick)="toggleCart()"
              >✕</ui-button
            >
          </header>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">
            @if (cartItems()?.length) {
              <!-- ───────── Desktop grid ───────── -->
              <div class="hidden md:block">
                <!-- header row -->
                <div
                  class="grid grid-cols-[120px_1fr_112px_112px_40px] gap-4
                         px-6 py-2 font-semibold text-sm sticky
                         bg-[var(--accent)] z-5"
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
                    class="grid grid-cols-[120px_1fr_112px_112px_40px] gap-4
                           px-6 py-4 items-center border-t border-white/5
                           hover:bg-black/5"
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

                    <!-- quantity (static) -->
                    <div class="justify-self-center font-medium text-center">
                      {{ item.selectedAmount }}
                    </div>

                    <!-- price -->
                    <div class="text-right whitespace-nowrap font-medium">
                      {{
                        item.book.price * item.selectedAmount
                          | currency: 'EUR' : 'symbol'
                      }}
                    </div>

                    <!-- remove -->
                    <ui-icon-button
                      icon="faClose"
                      description="Remove item"
                      size="sm"
                      [iconColor]="'var(--accent)'"
                      [iconSize]="'16px'"
                      (iconButtonClick)="removeItem(item.id)"
                      buttonNgClass="bg-slate-50"
                    ></ui-icon-button>
                  </div>
                }
              </div>

              <!-- ───────── Mobile cards ───────── -->
              <div class="md:hidden p-4 space-y-3">
                @for (item of cartItems(); track item.id) {
                  <div
                    class="rounded-xl bg-white p-3 flex flex-col gap-2 shadow-sm border border-gray-100"
                  >
                    <!-- Top: Image + Info + Remove -->
                    <div class="flex gap-3">
                      <img
                        [src]="item.book.photoUrl"
                        [alt]="item.book.title"
                        class="h-20 w-14 rounded-md object-cover flex-shrink-0"
                      />
                      <div
                        class="flex-1 flex flex-col justify-between gap-[1px]"
                      >
                        <span class="font-semibold text-sm leading-tight m-0">
                          {{ item.book.title }}
                        </span>
                        <span class="text-xs text-gray-500 m-0">
                          {{ item.book.author }} • {{ item.book.publishedDate }}
                        </span>
                        <span class="text-xs text-gray-400 m-0">
                          Genre: {{ item.book.genre }}
                        </span>
                      </div>
                      <ui-icon-button
                        icon="faClose"
                        description="Remove item"
                        size="sm"
                        [iconColor]="'var(--accent)'"
                        [iconSize]="'16px'"
                        (iconButtonClick)="removeItem(item.id)"
                        buttonNgClass="bg-slate-50"
                      ></ui-icon-button>
                    </div>

                    <!-- Bottom: Qty and Price -->
                    <div
                      class="flex items-start justify-between pt-2 border-t border-gray-100 text-sm"
                    >
                      <!-- Quantity badge -->
                      <span class="flex items-center gap-1">
                        <span
                          class="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-[2px] rounded-full"
                        >
                          Quantity
                        </span>
                        <span class="text-sm font-semibold text-gray-800">
                          {{ item.selectedAmount }}
                        </span>
                      </span>

                      <!-- Total + Unit Price -->
                      <span class="text-right">
                        <span class="block font-medium text-gray-800">
                          {{
                            item.book.price * item.selectedAmount
                              | currency: 'EUR' : 'symbol'
                          }}
                        </span>
                        <span class="block text-xs text-gray-400">
                          {{ item.book.price | currency: 'EUR' : 'symbol' }}
                          each
                        </span>
                      </span>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="p-4 pt-0 text-center text-sm opacity-70">
                Your cart is empty… fill it 🛒
              </p>
            }
          </div>

          <!-- Footer summary -->
          @if (cartItems()?.length) {
            <footer
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
            </footer>
          }
        </aside>
      </div>
    }
  `,
})
export class CartComponent implements OnInit, OnDestroy {
  /* Inputs */
  readonly cartItems = input<CartItem[]>();
  readonly isCartVisible = input<boolean>(false);

  /* Outputs */
  @Output() showCart = new EventEmitter<void>();
  @Output() cartItemDeleted = new EventEmitter<number>();
  @Output() checkoutClicked = new EventEmitter<void>();

  private sub = new Subscription();
  constructor(private bo: BreakpointObserver) {}

  ngOnInit() {
    this.sub = this.bo.observe('(max-width: 768px)').subscribe();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /* UI helpers */
  toggleCart() {
    this.showCart.emit();
  }
  removeItem(id: number) {
    this.cartItemDeleted.emit(id);
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
