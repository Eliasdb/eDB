import {
  ApplicationsCollectionContainer,
  UsersCollectionContainer,
} from './components';

import { CommonModule } from '@angular/common';
import { Component, signal, Type, ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminStatsContainer } from './components/admin-stats-container/admin-stats.container';

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page">
    <section>
      <h1 class="text-3xl">Admin</h1>
    </section>
    <admin-stats-container />
    <ui-content-switcher [options]="['Platform', 'Webshop']">
      <ng-container section1>
        <section class="flex flex-col gap-4">
          <platform-admin-applications-collection></platform-admin-applications-collection>
          <platform-admin-users-collection></platform-admin-users-collection>
        </section>
      </ng-container>
      <ng-container section2>
        <nav>
          <div class="nav-center">
            <button
              mat-raised-button
              (click)="drawer.toggle()"
              type="button"
              class="toggle-btn"
            >
              <img
                src="https://www.svgrepo.com/show/529002/hamburger-menu.svg"
                alt="toggle-btn"
                width="20"
              />
            </button>
          </div>
        </nav>
        <mat-drawer-container class="example-container">
          <mat-drawer #drawer [mode]="mode.value" [autoFocus]="false"
            ><admin-sidebar (itemSelected)="switchDrawerContent($event)"
          /></mat-drawer>
          <mat-select #mode value="push" />
          <mat-drawer-content>
            <div class="content">
              <ng-container [ngSwitch]="currentView()">
                <platform-admin-users-collection
                  *ngSwitchCase="'books'"
                ></platform-admin-users-collection>
                <platform-admin-applications-collection
                  *ngSwitchCase="'order-overview'"
                ></platform-admin-applications-collection>
              </ng-container>
            </div>
          </mat-drawer-content>
        </mat-drawer-container>
      </ng-container>
    </ui-content-switcher>
  </section>`,
  imports: [
    UiContentSwitcherComponent,
    UsersCollectionContainer,
    ApplicationsCollectionContainer,
    MatSidenavModule,
    MatSelectModule,
    AdminSidebarComponent,
    CommonModule,
    AdminStatsContainer,
  ],
  styleUrls: ['admin.page.scss'],
})
export class AdminPage {
  currentView = signal<'books' | 'order-overview'>('books');
  @ViewChild('drawer') drawer!: MatDrawer;

  // Optionally, if you still need to use a dynamic component outlet:
  get drawerContent(): Type<any> | null {
    return this.currentView() === 'books'
      ? AdminStatsContainer
      : AdminSidebarComponent;
  }

  switchDrawerContent(newContent: 'books' | 'order-overview') {
    console.log(`Switching view to: ${newContent}`);
    this.currentView.set(newContent);
    this.drawer.toggle();
  }
}
