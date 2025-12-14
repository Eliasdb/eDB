import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UiIconComponent } from '../../icon/icon.component';
import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'ui-breadcrumbs',
  imports: [MatIconModule, RouterLink, UiIconComponent],
  template: `
    <section class="ml-4 flex items-center gap-2">
      @for (c of crumbs; track c.label; let i = $index) {
        @if (c.route) {
          <a [routerLink]="c.route" class="underline underline-offset-4">
            {{ c.label }}
          </a>
        } @else {
          {{ c.label }}
        }

        @if (i < crumbs.length - 1) {
          <ui-icon name="faChevronRight"></ui-icon>
        }
      }
    </section>
  `,
})
export class BreadcrumbsComponent {
  @Input() crumbs: Breadcrumb[] = [];
}
