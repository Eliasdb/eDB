import { Component, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { BooksListItemComponent } from './books-list-item/books-list-item.component';

@Component({
  imports: [BooksListItemComponent],
  selector: 'books-collection-list-overview',
  template: `
    <section class="w-full flex flex-col gap-16">
      @for (book of books(); track $index) {
        <books-list-item [book]="book" />
      }
    </section>
  `,
})
export class BooksCollectionListOverviewComponent {
  readonly books = input<Book[]>();
}
