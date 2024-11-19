import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-portal-header',
  standalone: true,
  imports: [CommonModule, HeaderModule],
  template: `
    <cds-header [brand]="brandTemplate"></cds-header>
    <ng-template #brandTemplate>
      <a class="cds--header__name">
        <span class="cds--header__name--prefix">
          <div class="logo">
            <img
              src="https://i.ibb.co/7QfqfYc/logo.png"
              alt=""
              height="35"
              width="70"
            /></div
        ></span>
      </a>
    </ng-template>
  `,
  styleUrl: 'portal-header.component.scss',
})
export class UiPortalHeaderComponent {}
