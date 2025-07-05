/* ------------------------------------------------------------------ */
/* ui-nav-sidebar.component.ts – generic navigation drawer            */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
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
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <nav
      class="h-full w-[16rem] bg-gray-900 text-white flex flex-col p-4 pt-24"
    >
      <!-- ─── Brand row ───────────────────────────────────────────── -->
      <section class="flex items-start justify-between mb-8 pl-1.5">
        <div class="flex items-center gap-2">
          <!-- Let parent provide an <svg>, otherwise show a tiny rectangle -->
          <ng-content select="[sidebarLogo]"></ng-content>
          <div class="-mt-0.5 leading-tight">
            <div class="text-sm font-semibold">{{ brandTitle }}</div>
            <div class="text-xs text-gray-400">{{ brandSubtitle }}</div>
          </div>
        </div>

        <!-- collapse / star icon – consumer decides what to do -->
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

      <!-- ─── Menu ─────────────────────────────────────────────────── -->
      <nav class="h-full w-[16rem] bg-gray-900 text-white flex flex-col">
        <!-- brand row … -->

        <h3 class="text-xs mb-2 uppercase tracking-wider text-gray-400">
          {{ sectionLabel }}
        </h3>

        <ul class="flex-1 space-y-1 overflow-y-auto pr-1">
          <!-- ✅ use proper trackBy -->
          <li
            *ngFor="let itm of _items(); trackBy: trackId"
            (click)="select(itm)"
            class="outline-none"
          >
            <a
              [routerLink]="itm.route"
              routerLinkActive="bg-gray-800"
              class="flex items-center gap-3 rounded-md px-3 py-2
                   hover:bg-gray-800/70 transition text-white outline-none"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <mat-icon *ngIf="itm.icon">{{ itm.icon }}</mat-icon>
              <span class="text-sm">{{ itm.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </nav>
  `,
})
export class UiNavSidebarComponent {
  /* ---------- inputs ------------------------------------------------ */
  @Input() brandTitle = 'App';
  @Input() brandSubtitle = '';
  @Input() sectionLabel = 'Navigation';

  /** Full menu definition */
  @Input({ required: true }) set items(v: NavItem[]) {
    this._items.set(v ?? []);
  }
  protected _items = signal<NavItem[]>([]);

  /* ---------- outputs ----------------------------------------------- */
  @Output() navClick = new EventEmitter<string>(); //  id
  @Output() toggle = new EventEmitter<void>(); //  collapse / expand

  /* helper to emit id only */
  select(itm: NavItem) {
    this.navClick.emit(itm.id);
  }

  trackId(_: number, item: NavItem) {
    return item.id;
  }
}
