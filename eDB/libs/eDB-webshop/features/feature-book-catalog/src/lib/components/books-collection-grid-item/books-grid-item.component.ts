import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../types/book-param.type';

@Component({
  selector: 'books-grid-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (book()) {
      <section class="book-card">
        <a routerLink="/books/{{ book()?.id }}">
          <img src="{{ book()?.photoUrl }}" alt="{{ book()?.title }}" />
        </a>
        <div class="card-text">
          <h3>{{ book()?.title }}</h3>
        </div>
      </section>
    }
  `,
  styleUrls: ['./books-grid-item.component.scss'],
})
export class BooksGridItemComponent {
  readonly book = input<Book>();
}
