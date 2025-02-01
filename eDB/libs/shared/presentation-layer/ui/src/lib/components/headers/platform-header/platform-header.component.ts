import { Component, EventEmitter, Output, input } from '@angular/core';
import { HeaderModule } from 'carbon-components-angular';
import { UiPlatformOverflowMenuComponent } from '../../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  imports: [HeaderModule, UiPlatformOverflowMenuComponent],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name()">
      <!-- Hamburger Menu (for mobile) -->
      @if (hasHamburger()) {
        <cds-hamburger (click)="hamburgerToggle.emit($event)"></cds-hamburger>
      }

      @if (navigationLinks().length > 0) {
        <!-- Header Navigation -->
        <cds-header-navigation>
          @for (link of navigationLinks(); track link.id) {
            <cds-header-item
              (click)="linkClick.emit(link.id)"
              [isCurrentPage]="link.isCurrentPage"
            >
              {{ link.label }}
            </cds-header-item>
          }
        </cds-header-navigation>
      }

      @if (menuOptions().length > 0) {
        <cds-header-global>
          <ui-platform-overflow-menu
            placement="bottom"
            icon="faUser"
            [menuOptions]="menuOptions()"
            [flip]="true"
            [offset]="{ x: 0, y: 10 }"
            (menuOptionSelected)="menuOptionSelected.emit($event)"
          ></ui-platform-overflow-menu>
        </cds-header-global>
      }
      <!-- Global Actions -->
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
  readonly name = input<string>('eDB');
  readonly hasHamburger = input<boolean>(false);
  readonly navigationLinks = input<
    {
      id: string;
      label: string;
      isCurrentPage: boolean;
    }[]
  >([]);
  readonly menuOptions = input<
    {
      id: string;
      label: string;
    }[]
  >([]);

  @Output() hamburgerToggle = new EventEmitter<Event>();
  @Output() linkClick = new EventEmitter<string>();
  @Output() menuOptionSelected = new EventEmitter<string>();
}
