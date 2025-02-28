import { Component } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { StructuredListModule } from 'carbon-components-angular';

@Component({
  selector: 'app-cart-item',
  imports: [StructuredListModule],
  template: `
    <cds-structured-list>
      <cds-list-header>
        <cds-list-column>Cover</cds-list-column>
        <cds-list-column>Details</cds-list-column>
        <cds-list-column>Amount</cds-list-column>
        <cds-list-column>Price</cds-list-column>
      </cds-list-header>
      @for (book of books; track book.title) {
        <cds-list-row>
          <cds-list-column>
            <img
              [src]="book.photoUrl"
              [alt]="book.title"
              style="width: 50px; height: auto;"
            />
          </cds-list-column>
          <cds-list-column>
            <div>
              <strong>{{ book.title }}</strong>
            </div>
            <div>Author: {{ book.author }}</div>
            <div>Year: {{ book.publishedDate }}</div>
            <div>Genre: {{ book.genre }}</div>
          </cds-list-column>
          <cds-list-column>
            {{ book.genre }}
          </cds-list-column>
          <cds-list-column>
            {{ book.genre }}
          </cds-list-column>
        </cds-list-row>
      }
    </cds-structured-list>
  `,
})
export class CartItemComponent {
  books: Book[] = [
    {
      title: 'Angular for Beginners',
      author: 'John Doe',
      publishedDate: '2020',
      genre: 'Technology',
      // amount: 1,
      // price: 29.99,
      photoUrl: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
    },
    {
      title: 'Learning TypeScript',
      author: 'Jane Smith',
      publishedDate: '2019',
      genre: 'Programming',
      // amount: 2,
      // price: 39.99,
      photoUrl: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
    },
    {
      title: 'Advanced JavaScript',
      author: 'Jim Beam',
      publishedDate: '2021',
      genre: 'Technology',
      // amount: 1,
      // price: 49.99,
      photoUrl: 'https://edit.org/images/cat/book-covers-big-2019101610.jpg',
    },
  ];
}
