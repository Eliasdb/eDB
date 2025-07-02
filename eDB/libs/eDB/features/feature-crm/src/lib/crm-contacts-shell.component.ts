/* ------------------------------------------------------------------ */
/* crm-contacts-shell.component.ts – “listens” for toggle requests    */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SidebarToggleService, UiNavSidebarComponent } from '@edb/shared-ui';
import { NavItem } from 'libs/shared-client/ui/src/lib/components/sidebar-main/nav-sidebar.component';
import { CrmSidebarComponent } from './components/crm-sidebar.component';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'crm-contacts-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    UiNavSidebarComponent,
    CrmSidebarComponent,

    /* routing */
    RouterOutlet,
    RouterLink,
  ],
  template: `
    <div class="h-screen">
      <mat-drawer-container class="h-full">
        <!-- ◀ LEFT NAV --------------------------------------------------- -->
        <mat-drawer
          #leftNav
          position="start"
          mode="over"
          class="w-[16rem] bg-gray-900 text-white"
        >
          <ui-nav-sidebar
            [brandTitle]="'eDB'"
            [brandSubtitle]="'CRM'"
            [items]="crmMenu"
            (navClick)="leftNav.close()"
            (toggle)="leftNav.toggle()"
          >
            <span sidebarLogo>Ω</span>
          </ui-nav-sidebar>
        </mat-drawer>

        <!-- ▣ MAIN CONTENT ---------------------------------------------- -->
        <mat-drawer-content class=" bg-white pt-20">
          <header
            class="h-16 flex items-center gap-2 px-6 border-b border-gray-200 text-sm text-black"
          >
            <svg
              (click)="leftNav.open()"
              class="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
            <span class="text-gray-500">CRM</span>
            <span class="text-gray-400">/</span>
            <span class="text-gray-700 font-medium">Contacts</span>
          </header>

          <router-outlet></router-outlet>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class CrmContactsShellComponent implements OnInit, OnDestroy {
  /* expose the drawer so we can toggle it from the service */
  @ViewChild('leftNav', { static: true }) leftNav!: MatDrawer;

  constructor(private sidebarToggle: SidebarToggleService) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.sidebarToggle.toggle$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.leftNav.toggle());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* nav menu */
  readonly crmMenu: NavItem[] = [
    {
      id: 'contacts',
      label: 'Companies & Contacts',
      route: 'contacts',
      icon: 'people',
    },
    { id: 'reports', label: 'BTW-aangifte', route: 'btw', icon: 'bar_chart' },
    { id: 'settings', label: 'Settings', route: 'settings', icon: 'settings' },
  ];
}
