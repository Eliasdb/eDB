import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Book } from '../../types/book-param.type';

@Component({
  selector: 'books-list-item',
  standalone: true,
  imports: [RouterLink, CommonModule, MatButtonModule],
  template: `
    @if (book()) {
      <section class="book-card">
        <section class="book-img-container">
          <a routerLink="/books/{{ book()?.id }}">
            <img src="{{ book()?.photoUrl }}" alt="{{ book()?.title }}" />
          </a>
        </section>

        <div class="card-text">
          <h3>{{ book()?.title }}</h3>
          <p>
            <span style="font-weight: bold;">Author</span>: {{ book()?.author }}
          </p>
          <p>
            <span style="font-weight: bold;">Year</span>:
            {{ book()?.publishedDate }}
          </p>

          <p>{{ book()?.description }}</p>
          <button mat-raised-button routerLink="/books/{{ book()?.id }}">
            See more
          </button>
        </div>
      </section>
    }
  `,
  styleUrl: './books-list-item.component.scss',
})
export class BooksListItemComponent {
  readonly book = input<Book>();
}
