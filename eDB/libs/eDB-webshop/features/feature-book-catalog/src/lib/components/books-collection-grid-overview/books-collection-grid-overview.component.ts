import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { BooksGridItemComponent } from './books-collection-grid-item/books-grid-item.component';

@Component({
  selector: 'books-collection-grid-overview',
  standalone: true,
  imports: [BooksGridItemComponent],
  template: `
    <section
      class="grid auto-rows-auto gap-5 sm:gap-6"
      [style.gridTemplateColumns]="'repeat(auto-fill,minmax(14rem,1fr))'"
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
