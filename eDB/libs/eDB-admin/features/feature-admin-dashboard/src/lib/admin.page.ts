import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal, ViewChild } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { AdminDashboardComponent } from './components/test/admin-dashboard.component';

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  Tooltip,
} from 'chart.js';

Chart.register(
  LinearScale,
  CategoryScale,
  LineController,
  LineElement,
  BarElement,
  BarController,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
);

console.log('✅ Chart.js registered once in host:', Chart);

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page ">
    <admin-dashboard />
    <!-- <admin-stats-container />
    <ui-content-switcher [options]="['Platform', 'Webshop']">
      <ng-container section1>
        <section class="flex flex-col gap-4">
          <platform-admin-applications-collection></platform-admin-applications-collection>
          <platform-admin-users-collection></platform-admin-users-collection>
        </section>
      </ng-container>
      <ng-container section2>
        <section class="mx-4 mt-8 text-black">
          <h2 class="text-2xl">Webshop</h2>
          <p class="mt-2 mb-4">Manage books and orders for the webshop.</p>
        </section>
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
                <admin-books-collection-container
                  *ngSwitchCase="'books'"
                ></admin-books-collection-container>
                <platform-admin-applications-collection
                  *ngSwitchCase="'order-overview'"
                ></platform-admin-applications-collection>
              </ng-container>
            </div>
          </mat-drawer-content>
        </mat-drawer-container>
      </ng-container>
    </ui-content-switcher> -->
  </section>`,
  imports: [
    MatSidenavModule,
    MatSelectModule,
    CommonModule,

    AdminDashboardComponent,
  ],
  styleUrls: ['admin.page.scss'],
})
export class AdminPage implements OnDestroy {
  currentView = signal<'books' | 'order-overview'>('books');
  @ViewChild('drawer') drawer!: MatDrawer;

  switchDrawerContent(newContent: 'books' | 'order-overview') {
    console.log(`Switching view to: ${newContent}`);
    this.currentView.set(newContent);
    this.drawer.toggle();
  }

  ngOnDestroy() {
    console.log('[ADMIN] destroyed');
  }
}
