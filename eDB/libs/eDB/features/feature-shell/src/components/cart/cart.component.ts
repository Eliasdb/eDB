import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { UiButtonComponent } from '@eDB/shared-ui';

import { StructuredListModule } from 'carbon-components-angular';

@Component({
  selector: 'app-cart',
  imports: [StructuredListModule, UiButtonComponent],
  template: `
    <div @slideAnimation class="cart-container">
      <section class="cart">
        <cds-structured-list>
          <cds-list-header>
            <cds-list-column>Cover</cds-list-column>
            <cds-list-column>Details</cds-list-column>
            <cds-list-column>Amount</cds-list-column>
            <cds-list-column>Price</cds-list-column>
            <cds-list-column>Remove</cds-list-column>
          </cds-list-header>
          @for (book of books; track book.title) {
            <cds-list-row>
              <cds-list-column>
                <img
                  [src]="book.photoUrl"
                  [alt]="book.title"
                  style="width: 150px; height: auto;"
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
              <cds-list-column>
                <ui-button size="sm">Remove</ui-button>
              </cds-list-column>
            </cds-list-row>
          }
        </cds-structured-list>
        <section class="button">
          <ui-button size="sm" (buttonClick)="toggleCart()"
            >Proceed to checkout</ui-button
          >
        </section>
      </section>
    </div>
  `,
  styleUrl: 'cart.component.scss',
  animations: [
    trigger('slideAnimation', [
      // On enter: start off-screen above and slide down into view.
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      // On leave: ensure starting at position and slide up out of view.
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class CartComponent {
  @Output() showCart = new EventEmitter<Event>();

  toggleCart() {
    this.showCart.emit();
  }

  readonly isCartVisible = input<boolean>(false);

  animationDone(event: any) {
    console.log('Animation done:', event);
    // Optionally, if you need to remove the element after animation,
    // you could set a flag here once the exit animation is complete.
  }

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
