import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderModule } from 'carbon-components-angular'; // Import Carbon's HeaderModule
import { UiIconComponent } from '../../icon/icon.component'; // Assuming you have the IconComponent set up

@Component({
  selector: 'ui-platform-header',
  standalone: true,
  imports: [CommonModule, HeaderModule, UiIconComponent],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name">
      <!-- Hamburger Menu (for mobile) -->
      <cds-hamburger
        *ngIf="hasHamburger"
        (click)="expanded($event)"
      ></cds-hamburger>

      <!-- Header Navigation -->
      <cds-header-navigation>
        <cds-header-item>Catalog</cds-header-item>
        <cds-header-item>Docs</cds-header-item>
        <cds-header-item>Support</cds-header-item>

        <cds-header-menu title="Manage">
          <cds-header-item>Link 1</cds-header-item>
          <cds-header-item>Link 2</cds-header-item>
          <cds-header-item>Link 3</cds-header-item>
        </cds-header-menu>
      </cds-header-navigation>

      <!-- Global Actions (Icons for Settings and Logout) -->
      <cds-header-global>
        <cds-header-action description="Settings">
          <ui-icon [name]="settingsIcon" [size]="iconSize" [color]="iconColor">
          </ui-icon>
          <!-- Settings Icon -->
        </cds-header-action>
        <cds-header-action description="Logout">
          <ui-icon [name]="logoutIcon" [size]="iconSize" [color]="iconColor">
          </ui-icon>
          <!-- Logout Icon -->
        </cds-header-action>
      </cds-header-global>
    </cds-header>

    <!-- Brand Template -->
    <ng-template #brandTemplate>
      <a class="cds--header__name">
        <svg cdsIcon="carbon" size="32" style="stroke:white;fill:white"></svg>
        <span class="cds--header__name--prefix">eDB</span>
        [{{ platformName }}]
      </a>
    </ng-template>
  `,
})
export class UiPlatformHeaderComponent {
  @Input() name: string = 'eDB'; // Name for the platform in the header
  @Input() platformName: string = 'main'; // Custom platform name for branding
  @Input() hasHamburger: boolean = true; // Whether to show the hamburger menu
  @Output() hamburgerToggle = new EventEmitter<Event>(); // Event when hamburger is clicked

  // Icon names as properties
  settingsIcon: string = 'faCog'; // Settings icon name
  logoutIcon: string = 'faSignOutAlt'; // Logout icon name

  // Icon size and color properties
  iconSize: string = '1rem'; // Default icon size
  iconColor: string = 'black'; // Default icon color

  expanded(event: Event) {
    this.hamburgerToggle.emit(event); // Emit event when the hamburger is clicked
  }
}
