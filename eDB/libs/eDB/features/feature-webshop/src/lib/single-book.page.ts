/* ------------------------------------------------------------------
   Single-book view – polished mobile / desktop alignment
   · Reduced padding & gap on mobile so details sit right below cover
   · Responsive cover sizes: 9 rem → 17 rem
-------------------------------------------------------------------*/
import { CommonModule } from '@angular/common';
import { Component, effect, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';

import { BooksService } from '@eDB-webshop/client-books';
import { CartService } from '@eDB-webshop/client-cart';
import { CartItemCreateRequest } from '@eDB-webshop/shared-types';
import {
  LoadingStateComponent,
  QuantitySelectorComponent,
} from '@eDB-webshop/ui-webshop';
import { UiButtonComponent } from '@edb/shared-ui';

@Component({
  selector: 'single-book',
  standalone: true,
  imports: [
    CommonModule,
    LoadingStateComponent,
    MatRippleModule,
    MatButtonModule,
    UiButtonComponent,
    QuantitySelectorComponent,
  ],
  template: `
    <section
      class="min-h-screen pt-[10rem] sm:pt-[13rem] pb-24 px-6 xl:px-0 bg-[#f4f4f7] 
         max-w-[100%] xl:max-w-[82%] mx-auto flex justify-center"
    >
      <ui-webshop-books-loading-state *ngIf="bookResult.isLoading()" />
      <p *ngIf="bookResult.isError()" class="text-red-600">
        Error loading book
      </p>

      <ng-container *ngIf="book() as book">
        <div
          class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24 items-start"
        >
          <!-- Cover panel bg-[#e5e9f0] backup bg colour -->
          <div
            class="bg-[#e5e9f0]   rounded-lg p-6 py-16 sm:p-8 md:p-24  flex justify-center "
          >
            <img
              [src]="book.photoUrl"
              [alt]="book.title"
              class="
                w-full max-w-[6rem] sm:max-w-[11rem] md:max-w-[14rem] lg:max-w-[15rem]
                 object-cover shadow-[0_25px_60px_rgba(0,0,0,0.25)]
              "
            />
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
              <div class="text-2xl font-semibold">
                {{ book.price | currency: 'EUR' : 'symbol' }}
              </div>
              <ui-webshop-quantity-selector
                class="ml-auto"
                [max]="book.stock"
                [(quantity)]="selectedAmount"
              ></ui-webshop-quantity-selector>
              <ui-button
                class="min-w-[9rem]"
                (buttonClick)="addToCart(book.id)"
                style="--_bg: var(--button-primary-bg); --_fg: var(--button-primary-fg); --_bg-h: var(--button-primary-bg--hover); --_bg-a: var(--button-primary-bg--active);"
                >Add to cart</ui-button
              >
            </div>
          </div>
        </div>
      </ng-container>
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
    `,
  ],
})
export class SingleBookPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly booksService = inject(BooksService);
  private readonly cartService = inject(CartService);

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
    } else {
      const payload: CartItemCreateRequest = {
        id: bookId,
        selectedAmount: qty,
      };
      this.cartService.addToCart(payload);
    }
  }
}
