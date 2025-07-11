import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { BooksGridItemComponent } from './books-collection-grid-item/books-grid-item.component';

@Component({
  selector: 'books-collection-grid-overview',
  imports: [BooksGridItemComponent],
  template: `
    <section
      class="grid gap-4 sm:gap-6
     [grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))]
     sm:[grid-template-columns:repeat(auto-fill,minmax(13rem,1fr))]
     [grid-auto-rows:1fr]"
    >
      @for (book of books(); track book.id) {
        <books-grid-item [book]="book" />
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksCollectionGridOverviewComponent {
  readonly books = input<Book[]>();
}
