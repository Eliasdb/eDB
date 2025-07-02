/* ------------------------------------------------------------------ */
/* crm-sidebar.component.ts – “Admin-style” look & feel               */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'crm-sidebar',
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
      <!-- ───── header / logo row ───── -->
      <section class="flex items-start justify-between mb-8 pl-2">
        <!-- left: logo & product name -->
        <div class="flex items-center gap-2">
          <!-- little “Omega” logo to match admin example -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path
              d="M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21"
            />
          </svg>
          <div>
            <div class="text-sm font-semibold leading-5">eDB</div>
            <div class="text-xs text-gray-400 leading-3">CRM</div>
          </div>
        </div>

        <!-- right: little “collapse / star” icon -->
        <button
          mat-icon-button
          class="text-gray-400 hover:text-white -mt-1 -mr-1"
          (click)="toggleSidebar.emit()"
        >
          <mat-icon fontSet="material-icons-outlined">star</mat-icon>
        </button>
      </section>

      <!-- ───── nav items ───── -->
      <h3 class="text-xs mb-2 uppercase tracking-wider text-gray-400">
        Navigation
      </h3>

      <ul class="flex-1 space-y-1">
        <li
          *ngFor="let item of items(); track item.id"
          (click)="navClick.emit(item.id)"
        >
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-gray-800"
            class="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-800/70 transition"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
            <span class="text-sm">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [
    /* ensure full-height flex layout exactly like admin */
    `
      :host {
        display: block;
        height: 100%;
        width: 16rem; /* keeps width identical to Admin sidebar */
      }
    `,
  ],
})
export class CrmSidebarComponent {
  /** same simple menu-config API you already had */
  readonly items = input<
    { id: string; label: string; route: string; icon?: string }[]
  >([
    {
      id: 'contacts',
      label: 'Contacts',
      route: '/crm/contacts',
      icon: 'people',
    },
    {
      id: 'reports',
      label: 'Reports',
      route: '/crm/btw',
      icon: 'bar_chart',
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/crm/settings',
      icon: 'settings',
    },
  ]);

  /** fires when any link is clicked (handy if the drawer is “over” mode) */
  @Output() navClick = new EventEmitter<string>();
  /** fires when the little star / collapse icon is pressed */
  @Output() toggleSidebar = new EventEmitter<void>();
}
