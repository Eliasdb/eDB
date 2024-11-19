import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderModule } from 'carbon-components-angular';
import { UiPlatformOverflowMenuComponent } from '../../overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  standalone: true,
  imports: [CommonModule, HeaderModule, UiPlatformOverflowMenuComponent],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name">
      <!-- Hamburger Menu (for mobile) -->
      <cds-hamburger
        *ngIf="hasHamburger"
        (click)="expanded($event)"
      ></cds-hamburger>

      <!-- Header Navigation -->
      <cds-header-navigation>
        <cds-header-item (click)="navigateTo('dashboard')"
          >My eDB</cds-header-item
        >
        <cds-header-item (click)="navigateTo('profile')"
          >Profile</cds-header-item
        >
      </cds-header-navigation>

      <!-- Global Actions -->
      <cds-header-global>
        <ui-platform-overflow-menu
          [menuOptions]="menuOptions"
          [placement]="'bottom'"
          [flip]="true"
          [offset]="{ x: 0, y: 7 }"
          [icon]="'faUser'"
          (menuOptionSelected)="onMenuOptionSelected($event)"
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
              alt=""
              height="35"
            /></div
        ></span>
      </a>
    </ng-template>
  `,
})
export class UiPlatformHeaderComponent {
  @Input() name: string = 'eDB';
  @Input() hasHamburger: boolean = false;
  @Output() hamburgerToggle = new EventEmitter<Event>();

  private router = inject(Router);

  menuOptions = [
    { id: 'dashboard', label: 'My eDB' },
    { id: 'profile', label: 'Profile' },
    { id: 'logout', label: 'Logout' },
  ];

  expanded(event: Event): void {
    this.hamburgerToggle.emit(event);
  }

  navigateTo(target: string): void {
    this.router.navigate([target]);
  }

  onMenuOptionSelected(optionId: string): void {
    if (optionId === 'logout') {
      // Handle logout action
      console.log('Logging out...');
    } else {
      this.navigateTo(optionId);
    }
  }
}
