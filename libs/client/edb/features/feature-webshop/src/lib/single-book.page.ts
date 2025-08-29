/* ------------------------------------------------------------------
   Single-book view – polished mobile / desktop alignment
-------------------------------------------------------------------*/
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';

import { BooksService } from '@edb/client-books';
import { CartService } from '@edb/client-cart';
import { CartItemCreateRequest } from '@edb/shared-types';
import {
  LoadingStateComponent,
  QuantitySelectorComponent,
  UiButtonComponent,
} from '@edb/shared-ui';

@Component({
  selector: 'single-book',
  imports: [
    LoadingStateComponent,
    MatRippleModule,
    MatButtonModule,
    UiButtonComponent,
    QuantitySelectorComponent,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <section
      class="min-h-screen pt-[10rem] sm:pt-[13rem] pb-24 px-6 xl:px-0 bg-[#f4f4f7]
         max-w-[100%] xl:max-w-[82%] mx-auto flex justify-center"
      data-testid="book-details-root"
    >
      @if (book(); as book) {
        <div
          class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24 items-start"
        >
          <div
            class="bg-[#e5e9f0] rounded-lg p-6 py-16 sm:p-8 md:p-24 flex justify-center"
          >
            <div
              class="relative w-full max-w-[6rem] sm:max-w-[11rem] md:max-w-[14rem] lg:max-w-[15rem] aspect-[2/3]"
            >
              @if (book.blurDataUrl; as blur) {
                <img
                  [src]="blur"
                  class="absolute inset-0 w-full h-full object-cover blur-xl transition-opacity duration-700 ease-out will-change-[opacity]"
                  [class.opacity-100]="!imageLoaded()"
                  [class.opacity-0]="imageLoaded()"
                  aria-hidden="true"
                />
              }

              <img
                [src]="book.photoUrl"
                [alt]="book.title"
                loading="lazy"
                (load)="imageLoaded.set(true)"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in will-change-[opacity]"
                [class.opacity-0]="!imageLoaded()"
                [class.opacity-100]="imageLoaded()"
              />
            </div>
          </div>

          <!-- Details -->
          <div class="flex flex-col gap-6 sm:gap-8">
            <div>
              <p
                class="text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                {{ book.author }}
              </p>
              <h1
                class="text-3xl sm:text-4xl font-extrabold leading-tight mt-1 mb-2"
                data-testid="book-title"
              >
                {{ book.title }}
              </h1>
              <p class="italic text-gray-700 max-w-prose mb-3">
                {{ shortDescription }}
              </p>
              <details class="text-sm leading-relaxed text-gray-600">
                <summary class="cursor-pointer underline">
                  Read full description
                </summary>
                <p class="mt-2 whitespace-pre-line">{{ book.description }}</p>
              </details>
            </div>

            <div class="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span class="label">Year</span>
                <p>{{ book.publishedDate | date: 'y' }}</p>
              </div>
              <div>
                <span class="label">Genre</span>
                <p>{{ book.genre }}</p>
              </div>
              <div>
                <span class="label">Status</span>
                <p>{{ book.status }}</p>
              </div>
              <div>
                <span class="label">Stock</span>
                <p>{{ book.stock }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 pt-2 flex-wrap">
              <div class="text-2xl font-semibold" data-testid="book-price">
                {{ book.price | currency: 'EUR' : 'symbol' }}
              </div>

              <ui-webshop-quantity-selector
                class="ml-auto"
                [max]="book.stock"
                [(quantity)]="selectedAmount"
                data-testid="qty"
              ></ui-webshop-quantity-selector>

              <ui-button
                class="min-w-[9rem]"
                (buttonClick)="addToCart(book.id)"
                style="--_bg: var(--button-primary-bg); --_fg: var(--button-primary-fg); --_bg-h: var(--button-primary-bg--hover); --_bg-a: var(--button-primary-bg--active);"
                data-testid="add-to-cart"
                aria-label="Add to cart"
              >
                Add to cart
              </ui-button>
            </div>

            <!-- ✅ test-friendly, invisible status hook -->
          </div>
        </div>
      } @else if (bookResult.isLoading()) {
        <ui-webshop-books-loading-state />
      } @else if (bookResult.isError()) {
        <p class="text-red-600">Error loading book</p>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .label {
        @apply block font-semibold uppercase tracking-wide text-gray-500;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
})
export class SingleBookPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly booksService = inject(BooksService);
  private readonly cartService = inject(CartService);

  imageLoaded = signal(false);
  liveStatus = signal(''); // ✅ status text for tests & screen readers

  readonly routeParams = toSignal(this.activatedRoute.params);
  readonly bookId = () => this.routeParams()?.['id'];
  readonly bookResult = this.booksService.queryBookById;
  readonly book = () =>
    this.bookResult.isSuccess() ? this.bookResult.data().data : null;

  selectedAmount = model<number>(1);

  updateBookIdEffect = effect(() => {
    const id = Number(this.routeParams()?.['id']);
    if (!isNaN(id)) this.booksService.updateSelectedBookId(id);
  });

  syncWithCartEffect = effect(() => {
    const b = this.book();
    if (!b) return;
    const line = this.cartService.getItemByBookId(b.id);
    this.selectedAmount.set(line?.selectedAmount ?? 1);
  });

  get shortDescription(): string {
    const desc = this.book()?.description ?? '';
    const firstTwo = desc
      .split(/\.[\s\n]+/)
      .slice(0, 2)
      .join('. ');
    return firstTwo && firstTwo.length < desc.length
      ? firstTwo + '…'
      : firstTwo;
  }

  addToCart(bookId: number) {
    const qty = this.selectedAmount();
    const existing = this.cartService.getItemByBookId(bookId);

    if (existing) {
      this.cartService.updateItemQuantity(bookId, qty);
      // this.notify('Cart updated');
    } else {
      const payload: CartItemCreateRequest = {
        id: bookId,
        selectedAmount: qty,
      };
      this.cartService.addToCart(payload);
      // this.notify('Added to cart');
    }
  }
}
