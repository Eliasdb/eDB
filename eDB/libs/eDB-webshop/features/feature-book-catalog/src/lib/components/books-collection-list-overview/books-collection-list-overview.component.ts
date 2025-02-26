import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Book } from '../../types/book-param.type';
import { BooksListItemComponent } from '../books-list-item/books-list-item.component';

@Component({
  standalone: true,
  imports: [CommonModule, BooksListItemComponent],
  selector: 'books-collection-list-overview',
  template: `
    <section class="books-list-overview">
      @for (book of books(); track $index) {
        <div class="col-2">
          <books-list-item [book]="book" />
        </div>
      }
    </section>
  `,
  styleUrls: ['./books-collection-list-overview.component.scss'],
})
export class BooksCollectionListOverviewComponent {
  readonly books = input<Book[]>();
}
