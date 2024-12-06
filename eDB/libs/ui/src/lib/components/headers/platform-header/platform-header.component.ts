import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderModule } from 'carbon-components-angular';
import { UiPlatformOverflowMenuComponent } from '../../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  standalone: true,
  imports: [HeaderModule, UiPlatformOverflowMenuComponent],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name">
      <!-- Hamburger Menu (for mobile) -->
      @if (hasHamburger) {
        <cds-hamburger (click)="hamburgerToggle.emit($event)"></cds-hamburger>
      }

      <!-- Header Navigation -->
      <cds-header-navigation>
        @for (link of navigationLinks; track link.id) {
          <cds-header-item
            (click)="linkClick.emit(link.id)"
            [isCurrentPage]="link.isCurrentPage"
          >
            {{ link.label }}
          </cds-header-item>
        }
      </cds-header-navigation>

      <!-- Global Actions -->
      <cds-header-global>
        <ui-platform-overflow-menu
          placement="bottom"
          icon="faUser"
          [menuOptions]="menuOptions"
          [flip]="true"
          [offset]="{ x: 0, y: 10 }"
          (menuOptionSelected)="menuOptionSelected.emit($event)"
        ></ui-platform-overflow-menu>
      </cds-header-global>
    </cds-header>

    <!-- Brand Template -->
    <ng-template #brandTemplate>
      <a class="cds--header__name">
        <span class="cds--header__name--prefix">
          <div class="logo">
            <img
              src="https://i.ibb.co/7QfqfYc/logo.png"
              alt="eDB logo"
              width="70"
              height="35"
            />
          </div>
        </span>
      </a>
    </ng-template>
  `,
})
export class UiPlatformHeaderComponent {
  @Input() name: string = 'eDB';
  @Input() hasHamburger: boolean = false;
  @Input() navigationLinks: {
    id: string;
    label: string;
    isCurrentPage: boolean;
  }[] = [];
  @Input() menuOptions: { id: string; label: string }[] = [];

  @Output() hamburgerToggle = new EventEmitter<Event>();
  @Output() linkClick = new EventEmitter<string>();
  @Output() menuOptionSelected = new EventEmitter<string>();
}
