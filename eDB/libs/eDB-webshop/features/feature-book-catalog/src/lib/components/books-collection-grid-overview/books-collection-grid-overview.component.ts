import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { BooksGridItemComponent } from './books-collection-grid-item/books-grid-item.component';

@Component({
  imports: [BooksGridItemComponent],
  selector: 'books-collection-grid-overview',
  template: `
    <section
      class="grid justify-items-center grid-cols-2 gap-y-16 gap-x-0 sm:grid-cols-4 sm:gap-8 md:grid-cols-5 md:gap-16 xl:grid-cols-3 xl:gap-16"
    >
      @for (book of books(); track $index) {
        <div class="col-2">
          <books-grid-item [book]="book" />
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksCollectionGridOverviewComponent {
  readonly books = input<Book[]>();
}
