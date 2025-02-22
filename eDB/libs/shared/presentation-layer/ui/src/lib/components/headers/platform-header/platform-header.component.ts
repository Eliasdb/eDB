import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  input,
} from '@angular/core';
import { HeaderModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../../buttons/button/button.component';
import { UiPlatformOverflowMenuComponent } from '../../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  imports: [HeaderModule, UiPlatformOverflowMenuComponent, UiButtonComponent],
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
          <!-- Toggle button: text and target URL depend on environment -->
          @if (targetButtonText && targetUrl) {
            <div class="admin-btn">
              <a [href]="targetUrl">
                <ui-button size="sm" [icon]="'faArrowRight'">
                  {{ targetButtonText }}
                </ui-button>
              </a>
            </div>
          }
          <ui-platform-overflow-menu
            placement="bottom"
            icon="faUser"
            [menuOptions]="menuOptions()"
            [flip]="true"
            [offset]="{ x: 0, y: 0 }"
            (menuOptionSelected)="menuOptionSelected.emit($event)"
          ></ui-platform-overflow-menu>
        </cds-header-global>
      }
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
  styleUrls: ['platform-header.component.scss'],
})
export class UiPlatformHeaderComponent implements OnInit {
  readonly isAdmin = input<boolean | null>();
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

  targetButtonText: string | null = null;
  targetUrl: string | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const origin = window.location.origin;
    const currentPath = window.location.pathname;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Check if we're on localhost (development) or a deployed environment.
    if (hostname === 'localhost') {
      // Development environment:
      if (port === '4300') {
        // On the admin app (localhost:4300)
        this.targetButtonText = 'To Web App';
        // Assuming your web app is running on port 4200
        this.targetUrl = `http://localhost:4200/dashboard`;
      } else if (port === '4200') {
        // On the web app (localhost:4200)
        this.targetButtonText = 'To Admin App';
        // Assuming your admin app is running on port 4300
        this.targetUrl = `http://localhost:4300`;
      } else {
        // Fallback for other ports: use production-like logic.
        this.setProductionTarget(origin, currentPath);
      }
    } else {
      // Production/Staging: use path-based detection.
      this.setProductionTarget(origin, currentPath);
    }
  }

  // Set target based on production/staging path
  private setProductionTarget(origin: string, currentPath: string): void {
    const isAdminApp = currentPath.startsWith('/admin');
    if (isAdminApp) {
      this.targetButtonText = 'To Web App';
      this.targetUrl = origin; // Web app assumed to be at root
    } else {
      this.targetButtonText = 'To Admin App';
      this.targetUrl = `${origin}/admin`;
    }
  }
}
