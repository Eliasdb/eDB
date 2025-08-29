import { DecimalPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '@edb/shared-types';

@Component({
  selector: 'books-grid-item',
  imports: [RouterLink, DecimalPipe],
  template: `
    <article
      class="relative bg-[#f6fdff] rounded-lg border border-transparent shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between items-center text-center h-full px-8 pt-10 pb-8"
      data-testid="book-card"
      [attr.data-book-id]="book()?.id"
    >
      <!-- ♥ wishlist icon -->
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-pink-500 focus:outline-none"
        aria-label="Save to wishlist"
        data-testid="wishlist-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.44h.57C13.09 5.01 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </button>

      <!-- Title + author (fixed height) -->
      <div class="mb-6">
        <h3
          class="text-lg font-medium text-gray-900 leading-snug mb-1 max-w-[14ch]"
          data-testid="book-title"
        >
          {{ book()?.title }}
        </h3>
        <p
          class="text-sm text-gray-600 truncate max-w-[18ch]"
          data-testid="book-author"
        >
          {{ book()?.author }}
        </p>
      </div>

      <!-- Cover image with blur transition -->
      <a
        [routerLink]="['/webshop/books', book()?.id]"
        class="group relative w-40 h-60 flex items-center justify-center"
        data-testid="book-thumb-link"
      >
        <!-- Blur preview -->
        <img
          [src]="book()?.blurDataUrl"
          class="absolute inset-0 w-full h-full object-cover blur-lg transition-opacity duration-700 ease-out will-change-[opacity]"
          [class.opacity-100]="!imageLoaded()"
          [class.opacity-0]="imageLoaded()"
          aria-hidden="true"
        />

        <!-- Actual image -->
        <img
          [src]="book()?.photoUrl"
          [alt]="book()?.title"
          loading="lazy"
          (load)="imageLoaded.set(true)"
          class="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-opacity duration-700 ease-in will-change-[opacity]"
          [class.opacity-0]="!imageLoaded()"
          [class.opacity-100]="imageLoaded()"
          data-testid="book-thumb-img"
        />
      </a>

      <!-- Price / status pinned to bottom -->
      <div class="mt-auto pt-4 text-base font-semibold text-gray-900">
        @if (book()?.status === 'available') {
          <span data-testid="book-price">
            € {{ book()?.price | number: '1.2-2' }}
          </span>
        } @else {
          <span class="text-red-500" data-testid="book-status">Loaned</span>
        }
      </div>
    </article>
  `,
})
export class BooksGridItemComponent {
  readonly book = input<Book>();
  readonly imageLoaded = signal(false);
}
