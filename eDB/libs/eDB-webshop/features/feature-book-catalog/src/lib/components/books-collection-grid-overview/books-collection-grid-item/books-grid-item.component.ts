import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'books-grid-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <article
      class="bg-white border border-gray-200 rounded-lg overflow-hidden
         shadow-sm hover:shadow-md transition-shadow duration-200
         flex flex-col min-h-[22rem]"
    >
      <!-- keep aspect-ratio 2:3 -->
      <a
        [routerLink]="['/webshop', book()?.id]"
        class="block w-full aspect-[2/3] relative"
      >
        <img
          loading="lazy"
          [src]="book()?.photoUrl"
          [alt]="book()?.title"
          class="absolute inset-0 w-full h-full object-cover
             group-hover:opacity-90 transition-opacity duration-150"
        />
      </a>

      <div class="p-3 flex flex-col gap-[2px] flex-1">
        <h3
          class="font-semibold text-sm text-gray-900 leading-snug line-clamp-2"
        >
          {{ book()?.title }}
        </h3>
        <p class="text-xs text-gray-500 truncate">{{ book()?.author }}</p>

        <div class="flex justify-between items-center text-xs mt-auto pt-2">
          <span
            class="px-2 py-[1px] rounded-full bg-slate-100 text-slate-600 capitalize"
          >
            {{ book()?.genre }}
          </span>

          <ng-container [ngSwitch]="book()?.status">
            <span
              *ngSwitchCase="'available'"
              class="text-green-600 font-medium"
            >
              €{{ book()?.price | number: '1.2-2' }}
            </span>
            <span *ngSwitchDefault class="text-red-400 font-medium">
              Loaned
            </span>
          </ng-container>
        </div>
      </div>
    </article>
  `,
})
export class BooksGridItemComponent {
  readonly book = input<Book>();
}
