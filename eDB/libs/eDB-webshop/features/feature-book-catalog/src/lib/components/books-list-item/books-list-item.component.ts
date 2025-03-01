import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'books-list-item',
  imports: [RouterLink, MatButtonModule],
  template: `
    @if (book()) {
      <section
        class="flex flex-col sm:flex-row max-w-[40rem] w-full gap-4 mx-auto items-end"
      >
        <section
          class="flex-none w-full sm:w-2/5 aspect-[2/3] overflow-hidden rounded-[5px]"
        >
          <a (click)="navigateToBookDetails(book()?.id)">
            <img
              class="w-full h-full object-cover block"
              src="{{ book()?.photoUrl }}"
              alt="{{ book()?.title }}"
            />
          </a>
        </section>

        <div class="w-full flex-1 px-2 flex flex-col gap-2 break-words">
          <h3 class="m-0">{{ book()?.title }}</h3>
          <p class="m-0">
            <span class="font-bold">Author</span>: {{ book()?.author }}
          </p>
          <p class="m-0">
            <span class="font-bold">Year</span>: {{ book()?.publishedDate }}
          </p>
          <p class="m-0">{{ book()?.description }}</p>
          <button mat-raised-button routerLink="{{ book()?.id }}">
            See more
          </button>
        </div>
      </section>
    }
  `,
})
export class BooksListItemComponent {
  private router = inject(Router);
  readonly book = input<Book>();
  navigateToBookDetails(id: number | undefined) {
    this.router.navigate(['/', id]);
  }
}
