import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';

@Component({
  selector: 'breadcrumbs',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: ` <section class="breadcrumbs-container">
    <p class="title"><a routerLink="../../books">Books</a></p>
    <mat-icon>keyboard_arrow_right</mat-icon>
    <p>{{ book?.title }}</p>
  </section>`,
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  @Input() book?: Book | null;
}
