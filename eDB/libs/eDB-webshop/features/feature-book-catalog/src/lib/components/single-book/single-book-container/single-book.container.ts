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
import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';
import { UiButtonComponent } from '@eDB/shared-ui';
import { BreadcrumbsComponent } from '../../breadcrumbs/breadcrumbs.component';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';

@Component({
  selector: 'single-book',
  imports: [
    CommonModule,
    LoadingStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    BreadcrumbsComponent,
    UiButtonComponent,
    QuantitySelectorComponent,
  ],
  template: `
    <section class="flex flex-col mt-36 min-h-screen text-white">
      <!-- Loading state -->
      @if (bookResult.isLoading(); as loading) {
        <books-loading-state></books-loading-state>
      }

      <!-- Success state -->
      @if (bookResult.isSuccess(); as success) {
        <div class="b-crumbs text-black">
          <breadcrumbs [book]="book() || null" />
        </div>
        <mat-card>
          <mat-card-content>
            <section
              class="flex flex-col md:flex-row gap-8 p-4 items-center min-h-screen"
            >
              <div class="flex items-start justify-start flex-col gap-4">
                <div class="h-[15rem] w-[10rem]">
                  <img
                    src="https://edit.org/images/cat/book-covers-big-2019101610.jpg"
                    alt="book"
                    class="w-full h-full rounded-[0.25rem]"
                  />
                </div>
              </div>
              @if (book(); as book) {
                <div class="max-w-[31rem]">
                  <h3 class="font-semibold">{{ book.title }}</h3>
                  <p>{{ book.description }}</p>

                  <div class="grid grid-cols-[2fr_1fr]">
                    <div>
                      <p>
                        <span class="font-semibold">Author:</span>
                        {{ book.author }}
                      </p>
                      <p>
                        <span class="font-semibold">Genre:</span>
                        {{ book.genre }}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span class="font-semibold">Year:</span>
                        {{ book.publishedDate | date: 'y' }}
                      </p>
                      <p>
                        <span class="font-semibold">Status:</span>
                        {{ book.status }}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span class="font-semibold">Price:</span>
                        {{ book.price | currency: 'EUR' : 'symbol' }}
                      </p>
                      <p>
                        <app-quantity-selector
                          [max]="book.stock"
                          (quantityChange)="onQuantityChange($event)"
                        ></app-quantity-selector>
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div class="flex gap-4 justify-start mt-6">
                    <ui-button (buttonClick)="addToCart(book.id)"
                      >Add to cart</ui-button
                    >
                  </div>
                </div>
              }
            </section>
          </mat-card-content>
        </mat-card>
      }

      <!-- Error state -->
      @if (bookResult.isError(); as error) {
        <p>Error loading book details</p>
      }
    </section>
  `,
})
export class SingleBookContainer {
  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private cartService = inject(CartService);

  // Convert route parameters to a signal.
  readonly routeParams = toSignal(this.activatedRoute.params);
  readonly bookId = (): number => this.routeParams()?.['id'];
  selectedAmount: number = 0;

  // Query signals provided by the BooksService.
  readonly bookResult = this.booksService.queryBookById;
  // Derived signal: extract book data if the query was successful.
  readonly book = () =>
    this.bookResult.isSuccess() ? this.bookResult.data().data : null;

  // Effect: update the selected book id when the route parameter changes.
  updateBookIdEffect = effect(() => {
    const id = this.bookId();
    if (id) {
      this.booksService.updateSelectedBookId(id);
    }
  });

  addToCart(bookId: number) {
    const payload: CartItemCreateRequest = {
      id: bookId,
      selectedAmount: this.cartService.selectedAmount(), // get the latest value
    };

    this.cartService.addToCart(payload);
    // this.snackBar.open('Book added to cart', 'Close', { duration: 3000 });
  }

  onQuantityChange(newAmount: number) {
    console.log('New selected amount:', newAmount);
    this.cartService.selectedAmount.set(newAmount);
  }
}
