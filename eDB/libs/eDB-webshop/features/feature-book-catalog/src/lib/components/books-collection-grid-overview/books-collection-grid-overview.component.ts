import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { BooksGridItemComponent } from '../books-collection-grid-item/books-grid-item.component';

@Component({
  standalone: true,
  imports: [CommonModule, BooksGridItemComponent],
  selector: 'books-collection-grid-overview',
  template: `
    <section class="books-grid-overview">
      @for (book of books(); track $index) {
        <div class="col-2">
          <books-grid-item [book]="book" />
        </div>
      }
    </section>
  `,
  styleUrls: ['./books-collection-grid-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksCollectionGridOverviewComponent {
  readonly books = input<Book[]>();
}
