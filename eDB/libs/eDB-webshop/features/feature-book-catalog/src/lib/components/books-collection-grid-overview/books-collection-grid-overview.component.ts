import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Book } from '../../types/book-param.type';
import { BooksGridItemComponent } from '../books-collection-grid-item/books-grid-item.component';

@Component({
  standalone: true,
  imports: [CommonModule, BooksGridItemComponent],
  selector: 'books-collection-grid-overview',
  template: `
    <section class="books-grid-overview">
      <div *ngFor="let book of books" class="col-2">
        <books-grid-item [book]="book" />
      </div>
    </section>
  `,
  styleUrls: ['./books-collection-grid-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksCollectionGridOverviewComponent {
  @Input() books?: Book[];
}
