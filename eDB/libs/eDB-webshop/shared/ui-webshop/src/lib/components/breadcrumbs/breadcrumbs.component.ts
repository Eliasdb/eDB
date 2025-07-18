import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';
import { UiIconComponent } from '@edb/shared-ui';

@Component({
  selector: 'ui-webshop-bread-crumbs',
  imports: [MatIconModule, RouterLink, UiIconComponent],
  template: ` <section class="ml-4 flex items-center gap-2">
    <p class="title">
      <a class="underline underline-offset-4 text-inherit" routerLink="/webshop"
        >Books</a
      >
    </p>
    <ui-icon name="faChevronRight"></ui-icon>
    <p>{{ book?.title }}</p>
  </section>`,
})
export class BreadcrumbsComponent {
  @Input() book?: Book | null;
}
