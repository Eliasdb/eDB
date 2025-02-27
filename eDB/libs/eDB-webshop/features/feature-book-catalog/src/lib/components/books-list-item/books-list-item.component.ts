import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../types/book-param.type';

@Component({
  selector: 'books-list-item',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    @if (book()) {
      <section class="book-card">
        <section class="book-img-container">
          <a (click)="navigateToBookDetails(book()?.id)">
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
          <button mat-raised-button routerLink="{{ book()?.id }}">
            See more
          </button>
        </div>
      </section>
    }
  `,
  styleUrl: './books-list-item.component.scss',
})
export class BooksListItemComponent {
  private router = inject(Router);
  readonly book = input<Book>();
  navigateToBookDetails(id: number | undefined) {
    this.router.navigate(['/', id]);
  }
}
