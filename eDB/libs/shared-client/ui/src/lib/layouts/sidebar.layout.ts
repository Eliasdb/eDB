import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, input } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { UiNavSidebarComponent } from '../components/sidebar-main/nav-sidebar.component';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'ui-sidebar-layout-2',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    UiNavSidebarComponent,
    RouterOutlet,
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
            [brandTitle]="brandTitle()"
            [brandSubtitle]="brandSubtitle()"
            [items]="items()"
            (navClick)="leftNav.close()"
            (toggle)="leftNav.toggle()"
          >
            <span sidebarLogo>Ω</span>
          </ui-nav-sidebar>
        </mat-drawer>

        <!-- ▣ MAIN CONTENT ---------------------------------------------- -->
        <mat-drawer-content class="bg-white pt-20">
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
            <span class="text-gray-500">{{ brandSubtitle() }}</span>
            <span class="text-gray-400">/</span>
            <span class="text-gray-700 font-medium">{{ pageTitle() }}</span>
          </header>

          <router-outlet></router-outlet>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
})
export class UiSidebarLayoutSmarterComponent implements OnInit, OnDestroy {
  @ViewChild('leftNav', { static: true }) leftNav!: MatDrawer;

  readonly brandTitle = input<string>('Sidebar');
  readonly brandSubtitle = input<string>('Module');
  readonly pageTitle = input<string>('Page');
  readonly items = input<NavItem[]>([]);

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
}
