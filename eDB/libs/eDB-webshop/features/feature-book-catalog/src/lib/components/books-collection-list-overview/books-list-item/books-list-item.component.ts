import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'books-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    @if (book()) {
      <section
        class="flex max-w-[52rem] w-full mx-auto gap-4 p-6 bg-white/60 border border-slate-300 rounded-2xl shadow-sm flex-col sm:flex-row items-stretch"
      >
        <!-- Cover -->
        <section
          class="flex-none w-full sm:w-[160px] aspect-[2/3] overflow-hidden rounded-xl relative"
        >
          <a
            [routerLink]="['/webshop/books', book()?.id]"
            class="block w-full h-full"
          >
            <!-- Blur placeholder -->
            <img
              *ngIf="book()?.blurDataUrl && !imageLoaded"
              [src]="book()?.blurDataUrl"
              class="absolute inset-0 w-full h-full object-cover blur-xl scale-105 transition-opacity duration-500"
              aria-hidden="true"
            />

            <!-- Real image -->
            <img
              [src]="book()?.photoUrl"
              [alt]="book()?.title"
              (load)="imageLoaded = true"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </a>
        </section>

        <!-- Content -->
        <div class="flex flex-col justify-between flex-1">
          <div class="flex flex-col gap-2">
            <h3 class="text-base font-semibold text-slate-900 m-0">
              {{ book()?.title }}
            </h3>
            <p class="text-sm text-slate-700 m-0">
              <span class="font-medium">Author:</span> {{ book()?.author }}
            </p>
            <p class="text-sm text-slate-700 m-0">
              <span class="font-medium">Year:</span> {{ book()?.publishedDate }}
            </p>
            <p class="text-sm text-slate-700 m-0 line-clamp-5">
              {{ book()?.description }}
            </p>
          </div>

          <div class="mt-4">
            <button
              [routerLink]="['/webshop/books', book()?.id]"
              class="text-sm px-4 py-2 rounded-xl border border-slate-300 bg-white/60 text-slate-700 hover:bg-slate-100 transition-all"
            >
              See more
            </button>
          </div>
        </div>
      </section>
    }
  `,
})
export class BooksListItemComponent {
  private router = inject(Router);
  readonly book = input<Book>();
  imageLoaded = false;

  navigateToBookDetails(id: number | undefined) {
    this.router.navigate(['/', id]);
  }
}
