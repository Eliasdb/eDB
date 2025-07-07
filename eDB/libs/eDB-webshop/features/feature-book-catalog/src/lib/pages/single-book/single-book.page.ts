/* ------------------------------------------------------------------
   Single-book view
-------------------------------------------------------------------*/
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
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
  /* --------------------------------------------------------------
     IMPORTS
  -------------------------------------------------------------- */
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
  /* --------------------------------------------------------------
     TEMPLATE
  -------------------------------------------------------------- */
  template: `
    <!-- ❶ LIGHT BACKGROUND -->
    <section
      class="min-h-screen py-28 px-4"
      style="background: var(--surface-primary)"
    >
      <!-- Loading / Error states -->
      <ui-webshop-books-loading-state *ngIf="bookResult.isLoading()" />
      <p *ngIf="bookResult.isError()" class="text-center text-red-600">
        Error loading book details
      </p>

      <!-- Success -->
      <ng-container *ngIf="book() as book">
        <!-- ❷ BREADCRUMBS (raised z-index so always clickable) -->
        <nav class="max-w-6xl mx-auto mb-6 relative z-[51] pointer-events-auto">
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
                [src]="book.photoUrl || fallbackCover"
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
                  (quantityChange)="onQuantityChange($event)"
                />

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
      </ng-container>
    </section>
  `,
  /* --------------------------------------------------------------
     STYLES
  -------------------------------------------------------------- */
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
  /* ---------- injected services ---------- */
  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private cartService = inject(CartService);

  /* ---------- signals ---------- */
  readonly routeParams = toSignal(this.activatedRoute.params);
  readonly bookId = () => this.routeParams()?.['id'];
  readonly bookResult = this.booksService.queryBookById;
  readonly book = () =>
    this.bookResult.isSuccess() ? this.bookResult.data().data : null;

  readonly fallbackCover = 'https://placehold.co/400x600?text=No+Cover';

  /* ---------- effects ---------- */
  updateBookIdEffect = effect(() => {
    const id = this.bookId();
    if (id) this.booksService.updateSelectedBookId(id);
  });

  /* ---------- handlers ---------- */
  onQuantityChange(newAmount: number) {
    this.cartService.selectedAmount.set(newAmount);
  }

  addToCart(bookId: number) {
    const payload: CartItemCreateRequest = {
      id: bookId,
      selectedAmount: this.cartService.selectedAmount(),
    };
    this.cartService.addToCart(payload);
  }
}
