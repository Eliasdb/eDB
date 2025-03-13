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
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiPlatformOverflowMenuComponent } from '../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  imports: [HeaderModule, UiPlatformOverflowMenuComponent, UiButtonComponent],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name()" [class]="this.class()">
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
        <cds-header-global class="overflow-hidden">
          <!-- Toggle button: text and target URL depend on environment -->
          @if (targetButtonText && targetUrl) {
            <div class="admin-btn flex justify-center items-center">
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
          <div class="logo -ml-2">
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
export class UiPlatformHeaderComponent implements OnInit {
  readonly isAdmin = input<boolean | null>();
  readonly name = input<string>('eDB');
  readonly class = input<string>();

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
    const { origin, pathname, hostname, port } = window.location;
    const localTargets: Record<string, { text: string; url: string }> = {
      '4300': { text: 'To Web App', url: 'http://localhost:4200' },
      '4200': { text: 'To Admin App', url: 'http://localhost:4300' },
    };

    if (hostname === 'localhost' && localTargets[port]) {
      this.targetButtonText = localTargets[port].text;
      this.targetUrl = localTargets[port].url;
    } else {
      const isAdminApp = pathname.startsWith('/admin');
      this.targetButtonText = isAdminApp ? 'To Web App' : 'To Admin App';
      this.targetUrl = isAdminApp ? origin : `${origin}/admin`;
    }
  }
}
