import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { HeaderModule } from 'carbon-components-angular';
import { filter, Subscription } from 'rxjs';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiIconComponent } from '../icon/icon.component';
import { UiPlatformOverflowMenuComponent } from '../navigation/overflow-menu/overflow-menu.component';

@Component({
  selector: 'ui-platform-header',
  standalone: true,
  imports: [
    HeaderModule,
    UiPlatformOverflowMenuComponent,
    UiButtonComponent,
    RouterLink,
    CommonModule,
    RouterLinkActive,
    UiIconComponent,
  ],
  template: `
    <cds-header [brand]="brandTemplate" [name]="name()" [class]="this.class()">
      @if (hasHamburger()) {
        <cds-hamburger (click)="hamburgerToggle.emit($event)"></cds-hamburger>
      }

      @if (navigationLinks().length > 0) {
        <cds-header-navigation>
          <nav class="flex items-center gap-1 sm:gap-2">
            @for (link of navigationLinks(); track link.id) {
              <a
                [routerLink]="link.id === '' ? '/' : '/' + link.id"
                routerLinkActive="text-white after:absolute after:left-1 after:right-1 after:-bottom-0.5 after:h-0.5 after:bg-[var(--accent)]"
                [routerLinkActiveOptions]="{ exact: link.id === '' }"
                class="group relative inline-flex items-center gap-2 px-2 py-1 text-sm text-gray-400 hover:text-white transition"
              >
                <ui-icon *ngIf="link.icon" [name]="link.icon" size="sm" />
                <span class="font-medium">{{ link.label }}</span>
              </a>
            }
          </nav>
        </cds-header-navigation>
      }

      @if (menuOptions().length > 0) {
        <cds-header-global class="overflow-hidden">
          <div class="admin-btn flex justify-center items-center mr-4">
            <a [routerLink]="targetUrl">
              <ui-button
                size="sm"
                variant="ghost"
                icon="faArrowRight"
                class="
    [&>button]:text-blue-400
    [&>button]:bg-[#2c3748]
    [&>button:hover]:bg-[#374151]
    [&>button]:rounded-lg
    [&>button]:transition-colors
    [&>button]:px-4
    [&>button]:py-1.5
    [&>button]:text-sm
    [&>button]:font-medium
    [&>button:hover]:text-white
    [&>button]:[--cds-button-primary-hover:transparent]
    [&>button]:[--cds-button-primary-active:transparent]
  "
              >
                {{ targetButtonText }}
              </ui-button>
            </a>
          </div>

          <ui-platform-overflow-menu
            placement="bottom"
            icon="faGrip"
            [menuOptions]="menuOptions()"
            [flip]="true"
            [offset]="{ x: 20, y: 0 }"
            (menuOptionSelected)="menuOptionSelected.emit($event)"
          ></ui-platform-overflow-menu>
        </cds-header-global>
      }
    </cds-header>

    <ng-template #brandTemplate>
      <a class="cds--header__name">
        <span class="cds--header__name--prefix">
          <a routerLink="/" class="text-inherit">
            <div class="logo flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-omega"
              >
                <path
                  d="M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21"
                ></path>
              </svg>
              <span>eDB</span>
            </div>
          </a>
        </span>
      </a>
    </ng-template>
  `,
})
export class UiPlatformHeaderComponent implements OnInit, OnDestroy {
  readonly isAdmin = input<boolean | null>();
  readonly name = input<string>('eDB');
  readonly class = input<string>('container max-w-6xl');

  readonly hasHamburger = input<boolean>(false);
  readonly navigationLinks = input<
    {
      id: string;
      label: string;
      isCurrentPage: boolean;
      icon?: string; // FontAwesome icon
    }[]
  >([]);
  readonly menuOptions = input<{ id: string; label: string }[]>([]);

  @Output() hamburgerToggle = new EventEmitter<Event>();
  @Output() linkClick = new EventEmitter<string>();
  @Output() menuOptionSelected = new EventEmitter<string>();

  targetButtonText = '';
  targetUrl = '';

  private subscription!: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateTarget();

    this.subscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateTarget());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateTarget(): void {
    const pathname = this.document.location.pathname;
    const isAdmin = pathname.startsWith('/admin');

    this.targetButtonText = isAdmin ? 'To Web App' : 'To Admin App';
    this.targetUrl = isAdmin ? '/' : '/admin';
  }

  isActive(linkId: string): boolean {
    const currentPath = this.router.url.replace(/^\/+/, '');
    return currentPath === linkId;
  }
  getNavButtonClasses(linkId: string): string {
    const base =
      'relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const active =
      'text-blue-600 after:absolute after:inset-x-2 after:-bottom-0.5 after:h-0.5 after:bg-blue-600 after:content-[""]';
    const inactive = 'text-gray-700 hover:bg-gray-100';
    return `${base} ${this.isActive(linkId) ? active : inactive}`;
  }
}
