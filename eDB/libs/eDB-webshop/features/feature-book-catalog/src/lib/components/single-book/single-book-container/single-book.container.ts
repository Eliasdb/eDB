import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { BooksService } from '@eDB-webshop/client-books';
import { CartService } from '@eDB-webshop/client-cart';
import { BreadcrumbsComponent } from '../../breadcrumbs/breadcrumbs.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { AddButtonComponent } from '../single-book-add-button/single-book-add-button.component';

@Component({
  standalone: true,
  selector: 'single-book',
  imports: [
    CommonModule,
    LoadingStateComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    AddButtonComponent,
    MatRippleModule,
    BreadcrumbsComponent,
  ],
  template: `
    <section class="flex flex-col mt-32">
      <!-- Loading state -->
      @if (bookResult.isLoading(); as loading) {
        <books-loading-state></books-loading-state>
      }

      <!-- Success state -->
      @if (bookResult.isSuccess(); as success) {
        <div class="b-crumbs">
          <breadcrumbs [book]="book() || null" />
        </div>
        <mat-card>
          <mat-card-content>
            <section class="card-container">
              <div class="img">
                <div class="img-container">
                  <img
                    src="https://edit.org/images/cat/book-covers-big-2019101610.jpg"
                    alt="book"
                    class="single-book-image"
                  />
                </div>
              </div>
              @if (book(); as book) {
                <div class="book-info-container">
                  <h3>{{ book.title }}</h3>
                  <p>{{ book.description }}</p>

                  <div class="book-info">
                    <div>
                      <p>
                        <span class="bold-text">Author:</span>
                        {{ book.author }}
                      </p>
                      <p>
                        <span class="bold-text">Genre:</span>
                        {{ book.genre }}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span class="bold-text">Year:</span>
                        {{ book.publishedDate | date: 'y' }}
                      </p>
                      <p>
                        <span class="bold-text">Status:</span>
                        {{ book.status }}
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div class="btn-container">
                    @if (user.isSuccess(); as userSuccess) {
                      <add-button
                        [book]="book"
                        (add)="addToCart()"
                      ></add-button>
                    }
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
  styleUrls: ['./single-book.container.scss'],
})
export class SingleBookContainer {
  private activatedRoute = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  // Convert route parameters to a signal.
  readonly routeParams = toSignal(this.activatedRoute.params);
  readonly bookId = () => this.routeParams()?.['id'];

  // Query signals provided by the BooksService.
  // Note: These are not callable as functions; instead, access their signal properties.
  readonly bookResult = this.booksService.queryBookById;
  readonly relatedBooksResult = this.booksService.queryBooksByGenre;

  // Derived signal: extract book data if the query was successful.
  readonly book = () =>
    this.bookResult.isSuccess() ? this.bookResult.data().data : null;

  // Dummy user signal (replace with your actual user signal).
  readonly user = {
    isSuccess: () => true,
  };

  // Effect: update the selected book id when the route parameter changes.
  updateBookIdEffect = effect(() => {
    const id = this.bookId();

    if (id) {
      this.booksService.updateSelectedBookId(Number(id));
    }
  });

  // Effect: once the book is loaded, update the selected genre for related books.
  updateGenreEffect = effect(() => {
    const currentBook = this.book();
    if (currentBook) {
      this.booksService.updateSelectedGenre(currentBook.genre);
    }
  });

  addToCart() {
    const currentBook = this.book();
    if (currentBook) {
      this.cartService.addToCart(currentBook);
      // Optionally, show a snackbar notification here.
      // this.snackBar.open('Book added to cart', 'Close', { duration: 3000 });
    }
  }
}
