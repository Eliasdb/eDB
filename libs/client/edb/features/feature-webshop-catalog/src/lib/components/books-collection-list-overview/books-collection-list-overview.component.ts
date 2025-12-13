import { Component, input } from '@angular/core';
import { Book } from '@edb/shared-types';
import { BooksListItemComponent } from './books-list-item/books-list-item.component';

@Component({
  imports: [BooksListItemComponent],
  selector: 'webshop-books-collection-list-overview',
  template: `
    <section
      class="w-full flex flex-col gap-16"
      data-testid="books-list-wrapper"
    >
      @for (book of books(); track $index) {
        <webshop-books-list-item [book]="book" />
      }
    </section>
  `,
})
export class BooksCollectionListOverviewComponent {
  readonly books = input<Book[]>();
}
