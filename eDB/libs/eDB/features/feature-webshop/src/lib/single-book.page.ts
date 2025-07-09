/* ------------------------------------------------------------------
   Single-book view
-------------------------------------------------------------------*/
import { CommonModule } from '@angular/common';
import { Component, effect, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import { BooksService } from '@eDB-webshop/client-books';
import { CartService } from '@eDB-webshop/client-cart';
import { CartItemCreateRequest } from '@eDB-webshop/shared-types';
import {
  BreadcrumbsComponent,
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

    /* Material */
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,

    /* Local UI */
    BreadcrumbsComponent,
    UiButtonComponent,
    QuantitySelectorComponent,
  ],
  template: `
    <!-- ❶ LIGHT BACKGROUND -->
    <section
      class="min-h-screen py-28 pt-[12rem] px-4 flex items-center justify-center"
      style="background: var(--surface-primary)"
    >
      <!-- Loading / Error states -->
      <ui-webshop-books-loading-state *ngIf="bookResult.isLoading()" />
      <p *ngIf="bookResult.isError()" class="text-center text-red-600">
        Error loading book details
      </p>

      <!-- Success -->
      <ng-container *ngIf="book() as book" class="flex flex-col">
        <div>
          <!-- ❷ BREADCRUMBS -->
          <nav
            class="max-w-6xl mx-auto mb-6 relative z-[49] pointer-events-auto"
          >
            <ui-webshop-bread-crumbs [book]="book" />
          </nav>

          <!-- ❸ CARD -->
          <mat-card
            class="max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden relative z-10"
            style="
              background: var(--surface-card);
              color: var(--text-primary);
              border: 1px solid var(--border-subtle);
              box-shadow: 0 8px 24px var(--shadow-color);
            "
          >
            <div class="grid grid-cols-1 md:grid-cols-[minmax(10rem,1fr)_2fr]">
              <!-- Cover -->
              <div class="bg-slate-100 flex justify-center items-start p-8">
                <img
                  [src]="book.photoUrl"
                  [alt]="book.title"
                  class="w-full max-w-xs rounded-lg object-cover"
                />
              </div>

              <!-- Details -->
              <div class="p-8 flex flex-col gap-6">
                <!-- Title & description -->
                <header>
                  <h1 class="text-3xl font-bold mb-2">{{ book.title }}</h1>
                  <p class="text-gray-600">{{ book.description }}</p>
                </header>

                <!-- Meta grid -->
                <div class="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span class="label">Author</span>
                    <p>{{ book.author }}</p>
                  </div>
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

                <!-- ❹ ACTION BAR -->
                <div
                  class="mt-auto pt-4 border-t flex flex-wrap items-center gap-4"
                >
                  <div class="text-2xl font-semibold">
                    {{ book.price | currency: 'EUR' : 'symbol' }}
                  </div>

                  <ui-webshop-quantity-selector
                    class="ml-auto"
                    [max]="book.stock"
                    [(quantity)]="selectedAmount"
                  >
                  </ui-webshop-quantity-selector>

                  <ui-button
                    class="min-w-[9rem]"
                    (buttonClick)="addToCart(book.id)"
                    style="
                      --_bg: var(--button-primary-bg);
                      --_fg: var(--button-primary-fg);
                      --_bg-h: var(--button-primary-bg--hover);
                      --_bg-a: var(--button-primary-bg--active);
                    "
                  >
                    Add to cart
                  </ui-button>
                </div>
              </div>
            </div>
          </mat-card>
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
        @apply block font-semibold uppercase tracking-wide;
        color: var(--text-secondary);
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
    const raw = this.routeParams()?.['id'];
    const id = Number(raw);
    if (!isNaN(id)) {
      this.booksService.updateSelectedBookId(id);
    }
  });

  /** Only mirror cart ➜ selector when user *is not* editing */
  // wanted new version
  syncWithCartEffect = effect(() => {
    const b = this.book();
    if (!b) return;

    const line = this.cartService.getItemByBookId(b.id);
    this.selectedAmount.set(line?.selectedAmount ?? 1); // always sync
  });

  addToCart(bookId: number) {
    const qty = this.selectedAmount();
    const already = this.cartService.getItemByBookId(bookId);

    if (already) {
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
