// books-collection-grid-overview.component.ts
import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Book } from '@edb/shared-types';
import { BooksGridItemComponent } from './books-collection-grid-item/books-grid-item.component';

@Component({
  selector: 'books-collection-grid-overview',
  standalone: true,
  imports: [BooksGridItemComponent, NgClass],
  template: `
    <section
      class="grid auto-rows-fr gap-x-1 gap-y-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6"
    >
      @for (book of books(); track book.id; let idx = $index) {
        <books-grid-item
          [book]="book"
          class="xl:col-span-2"
          [ngClass]="{ 'xl:col-span-3': isWide(idx) }"
        />
      }
    </section>
  `,
})
export class BooksCollectionGridOverviewComponent {
  readonly books = input<Book[]>();

  isWide(i: number): boolean {
    const r = i % 5;
    return r === 3 || r === 4;
  }
}
