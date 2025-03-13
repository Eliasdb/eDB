import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'books-grid-item',
  imports: [RouterLink],
  template: `
    @if (book()) {
      <section class="max-w-[10rem] max-h-[15rem] rounded-[5px]">
        <a routerLink="{{ book()?.id }}">
          <img
            src="{{ book()?.photoUrl }}"
            alt="{{ book()?.title }}"
            class="w-full h-full rounded-[5px]"
          />
        </a>
        <div class="flex flex-col">
          <h3 class="text-[13px]">{{ book()?.title }}</h3>
        </div>
      </section>
    }
  `,
})
export class BooksGridItemComponent {
  readonly book = input<Book>();
}
