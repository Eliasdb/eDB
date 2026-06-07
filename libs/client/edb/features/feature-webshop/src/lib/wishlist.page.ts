import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '@edb/client-books';

@Component({
  selector: 'webshop-wishlist-page',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <section class="mt-40 min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div class="mx-auto max-w-5xl">
        <header class="mb-8">
          <h1 class="mb-2 text-4xl font-extrabold">Your Wishlist</h1>
          <p class="max-w-xl text-sm text-slate-600">
            Books saved from the catalog are shown here.
          </p>
        </header>

        @if (wishlist.items().length) {
          <div class="grid gap-4">
            @for (book of wishlist.items(); track book.id) {
              <article
                class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
              >
                <a
                  [routerLink]="['/webshop/books', book.id]"
                  class="block h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100"
                >
                  <img
                    [src]="book.photoUrl"
                    [alt]="book.title"
                    class="h-full w-full object-contain"
                  />
                </a>

                <div class="min-w-0 flex-1">
                  <h2 class="text-xl font-semibold text-slate-950">
                    {{ book.title }}
                  </h2>
                  <p class="text-sm text-slate-600">{{ book.author }}</p>
                  <p class="mt-2 text-sm text-slate-500">{{ book.genre }}</p>
                </div>

                <div
                  class="flex items-center justify-between gap-4 sm:flex-col sm:items-end"
                >
                  <p class="text-lg font-bold">
                    {{ book.price | currency: 'EUR' }}
                  </p>
                  <button
                    type="button"
                    class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    (click)="wishlist.remove(book.id)"
                  >
                    Remove
                  </button>
                </div>
              </article>
            }
          </div>
        } @else {
          <div
            class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"
          >
            <h2 class="text-2xl font-bold text-slate-950">
              No saved books yet
            </h2>
            <p class="mt-2 text-sm text-slate-600">
              Use the heart icon on catalog cards to add books here.
            </p>
            <a
              routerLink="/webshop"
              class="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to catalog
            </a>
          </div>
        }
      </div>
    </section>
  `,
})
export class WishlistPageComponent {
  readonly wishlist = inject(WishlistService);
}
