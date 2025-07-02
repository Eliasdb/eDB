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
      class="h-full w-[16rem] bg-gray-900 text-white flex flex-col p-4 pt-20"
    >
      <!-- ─── Brand row ───────────────────────────────────────────── -->
      <section class="flex items-start justify-between mb-8 pl-1.5">
        <div class="flex items-center gap-2">
          <!-- Let parent provide an <svg>, otherwise show a tiny rectangle -->
          <ng-content select="[sidebarLogo]"></ng-content>
          <span
            *ngIf="!hasLogo"
            class="inline-block w-4 h-4 bg-white/20"
          ></span>

          <div class="-mt-0.5 leading-tight">
            <div class="text-sm font-semibold">{{ brandTitle }}</div>
            <div class="text-xs text-gray-400">{{ brandSubtitle }}</div>
          </div>
        </div>

        <!-- collapse / star icon – consumer decides what to do -->
        <button
          mat-icon-button
          class="text-gray-400 hover:text-white -mt-1 -mr-1"
          (click)="toggle.emit()"
        >
          <mat-icon fontSet="material-icons-outlined">star</mat-icon>
        </button>
      </section>

      <!-- ─── Menu ─────────────────────────────────────────────────── -->
      <nav
        class="h-full w-[16rem] bg-gray-900 text-white flex flex-col p-4 pt-20"
      >
        <!-- brand row … -->

        <h3 class="text-xs mb-2 uppercase tracking-wider text-gray-400">
          {{ sectionLabel }}
        </h3>

        <ul class="flex-1 space-y-1 overflow-y-auto pr-1">
          <!-- ✅ use proper trackBy -->
          <li
            *ngFor="let itm of _items(); trackBy: trackId"
            (click)="select(itm)"
          >
            <a
              [routerLink]="itm.route"
              routerLinkActive="bg-gray-800"
              class="flex items-center gap-3 rounded-md px-3 py-2
                   hover:bg-gray-800/70 transition"
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

  /** True when parent projected something into `[sidebarLogo]` slot */
  @Input() hasLogo = false;

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
