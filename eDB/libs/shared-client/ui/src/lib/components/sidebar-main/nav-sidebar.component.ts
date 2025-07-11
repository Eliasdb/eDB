import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'ui-nav-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  template: `
    <nav
      class="h-full w-[16rem] bg-gray-900 text-white flex flex-col p-4 pt-24"
    >
      <!-- Brand row -->
      <section class="flex items-start justify-between mb-8 pl-2">
        <div class="flex items-center gap-2">
          <ng-content select="[sidebarLogo]"></ng-content>
          <div class="leading-tight">
            <div class="text-sm font-semibold">{{ brandTitle() }}</div>
            <div class="text-xs leading-[0.75rem] text-gray-400">
              {{ brandSubtitle() }}
            </div>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          (click)="toggle.emit()"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-star ml-auto scale-75 mt-1"
          aria-hidden="true"
        >
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
          ></path>
        </svg>
      </section>

      <!-- Menu -->
      <nav class="h-full w-[16rem] bg-gray-900 text-white flex flex-col">
        <h3 class="text-xs mb-2 uppercase tracking-wider text-gray-400">
          {{ sectionLabel() }}
        </h3>

        <ul class="flex-1 space-y-1 overflow-y-auto pr-1">
          @for (itm of items(); track itm.id) {
            <li (click)="select(itm)" class="outline-none">
              <a
                [routerLink]="itm.route"
                routerLinkActive="bg-gray-800"
                class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-800/70 transition text-white outline-none"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                @if (itm.icon) {
                  <mat-icon>{{ itm.icon }}</mat-icon>
                }
                <span class="text-sm">{{ itm.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>
    </nav>
  `,
})
export class UiNavSidebarComponent {
  readonly brandTitle = input('App');
  readonly brandSubtitle = input('');
  readonly sectionLabel = input('Navigation');
  readonly items = input<NavItem[]>([]);

  @Output() navClick = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>();

  select(itm: NavItem) {
    this.navClick.emit(itm.id);
  }
}
