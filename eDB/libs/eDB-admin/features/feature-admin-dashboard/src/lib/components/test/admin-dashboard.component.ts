// ─────────────────────────────────────────────────────────────
// admin-dashboard.component.ts   (breadcrumb text animation 🌀)
// ─────────────────────────────────────────────────────────────
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { TilesModule } from 'carbon-components-angular';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { TitleCasePipe } from '@angular/common';
import { ApplicationsCollectionContainer } from '../platform/applications-collection/applications-collection.container';
import { UsersCollectionContainer } from '../platform/users-collection/users-collection.container';
import { WebshopBooksTableComponent } from '../webshop/books-table/books-table.component';
import { AdminOrdersListComponent } from '../webshop/order-collection/order.collection';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  selector: 'admin-dashboard',
  imports: [
    MatDrawerContent,
    MatDrawerContainer,
    MatDrawer,
    MatSidenavModule,
    TilesModule,
    AdminSidebarComponent,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective,
    UsersCollectionContainer,
    ApplicationsCollectionContainer,
    WebshopBooksTableComponent,
    AdminOrdersListComponent,
    TitleCasePipe,
  ],
  animations: [
    /* --------------------------------------------------------
     * Flip/Fade animation for the breadcrumb text
     * ------------------------------------------------------ */
    trigger('viewFlip', [
      transition('platform <=> webshop', [
        /* leave phase                                                           */
        style({ opacity: 0, transform: 'rotateX(90deg)' }),
        /* enter phase                                                           */
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'rotateX(0deg)' }),
        ),
      ]),
    ]),
  ],
  template: `
    <mat-drawer-container class="h-[calc(100dvh-5rem)] relative">
      <!-- Side-nav ----------------------------------------------------------- -->
      <mat-drawer
        #drawer
        [mode]="sidenavMode"
        [(opened)]="isDrawerOpen"
        class="drawer bg-gray-900 text-white"
        [class.closed]="!isDrawerOpen"
      >
        <admin-sidebar
          [isOpen]="drawer.opened"
          (toggleSidebar)="drawer.toggle()"
          (itemSelected)="switchDrawerContent($event)"
        ></admin-sidebar>
      </mat-drawer>

      <!-- Main content ------------------------------------------------------- -->
      <mat-drawer-content>
        <div class="pt-0 bg-slate-50 text-black min-h-[calc(100dvh-5rem)]">
          <!-- Top bar / breadcrumb ------------------------------------------- -->
          <div
            class="h-16 bg-white flex items-center border-b border-[#e5e7eb] px-6 text-sm"
          >
            <svg
              (click)="drawer.open()"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-panel-left cursor-pointer scale-[0.7] mr-1 shrink-0"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>

            <div class="shrink-0 bg-border w-[1px] h-4 mx-2"></div>

            <span class="text-gray-500">Admin</span>
            <span class="text-gray-400 mx-1">/</span>

            <!-- 🌀 Animated section title -->
            <span
              [@viewFlip]="currentView()"
              class="inline-block text-gray-700 font-medium  origin-top"
            >
              {{ currentView() | titlecase }}
            </span>
          </div>

          @if (currentView() === 'platform') {
            <div class="p-6">
              <h2 class="mb-4 text-2xl font-medium">Dashboard</h2>

              <div class="flex flex-col md:flex-row gap-4 mb-4">
                <cds-tile class="flex-1 border rounded-[0.375rem]">
                  <h5 class="mb-1 font-light opacity-80">Total Revenue</h5>
                  <h3 class="text-xl font-medium">{{ totalRevenue }}</h3>
                </cds-tile>
                <cds-tile class="flex-1 border rounded-[0.375rem]">
                  <h5 class="mb-1 font-light opacity-80">Customers</h5>
                  <h3 class="text-xl font-medium">{{ customers }}</h3>
                </cds-tile>
                <cds-tile class="flex-1 border rounded-[0.375rem]">
                  <h5 class="mb-1 font-light opacity-80">Avg Order Value</h5>
                  <h3 class="text-xl font-medium">{{ avgOrderValue }}</h3>
                </cds-tile>
                <cds-tile class="flex-1 border rounded-[0.375rem]">
                  <h5 class="mb-1 font-light opacity-80">Sessions</h5>
                  <h3 class="text-xl font-medium">{{ sessions }}</h3>
                </cds-tile>
              </div>

              <div class="flex flex-col md:flex-row gap-4 mb-4">
                <cds-tile
                  class="flex-1 border rounded-[0.375rem] p-4 flex flex-col"
                >
                  <h4 class="mb-2 text-lg font-medium">Revenue</h4>
                  <div class="flex-1 min-h-[300px]">
                    <canvas
                      baseChart
                      [data]="revenueChartData"
                      [options]="revenueChartOptions"
                      chartType="line"
                    ></canvas>
                  </div>
                </cds-tile>
                <cds-tile
                  class="flex-1 border rounded-[0.375rem] p-4 flex flex-col"
                >
                  <h4 class="mb-2 text-lg font-medium">Sales by Category</h4>
                  <div class="flex-1 min-h-[300px]">
                    <canvas
                      baseChart
                      [data]="salesCategoryChartData"
                      [options]="salesCategoryChartOptions"
                      chartType="pie"
                    ></canvas>
                  </div>
                </cds-tile>
              </div>

              <div class="flex flex-col md:flex-row gap-4">
                <cds-tile class="flex-1 border rounded-[0.375rem] p-4">
                  <platform-admin-applications-collection></platform-admin-applications-collection>
                </cds-tile>
                <cds-tile class="flex-1 border rounded-[0.375rem] p-4">
                  <h4 class="mb-2 text-lg font-medium">Top Products</h4>
                  <ul class="list-none p-0 m-0">
                    <li
                      class="flex justify-between py-1 border-b border-gray-700"
                    >
                      <span>Smartphone</span>
                      <span>1,320</span>
                    </li>
                    <li
                      class="flex justify-between py-1 border-b border-gray-700"
                    >
                      <span>Laptop</span>
                      <span>883</span>
                    </li>
                    <li
                      class="flex justify-between py-1 border-b border-gray-700"
                    >
                      <span>Headphones</span>
                      <span>520</span>
                    </li>
                    <li
                      class="flex justify-between py-1 border-b border-gray-700"
                    >
                      <span>Speakers</span>
                      <span>315</span>
                    </li>
                    <li class="flex justify-between py-1">
                      <span>Watch</span>
                      <span>290</span>
                    </li>
                  </ul>
                </cds-tile>
              </div>

              <div class="px-4">
                <platform-admin-users-collection></platform-admin-users-collection>
              </div>
            </div>
          }
          @if (currentView() === 'webshop') {
            <section class="p-6">
              <h2 class="mb-4 text-2xl font-medium">Webshop Management</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Books Table (takes full width on mobile, half on desktop) -->
                <cds-tile class="border rounded-[0.375rem] p-4 col-span-1">
                  <h4 class="mb-4 text-lg font-medium">Books</h4>
                  <div class="max-h-[28rem] overflow-y-auto pr-2">
                    <webshop-books-table />
                  </div>
                </cds-tile>

                <cds-tile class="border rounded-[0.375rem] p-4 col-span-1">
                  <h4 class="mb-4 text-lg font-medium">Orders</h4>
                  <div class="max-h-[28rem] overflow-y-auto pr-2">
                    <admin-orders-list />
                  </div>
                </cds-tile>
              </div>
            </section>
          }
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class AdminDashboardComponent {
  /* Drawer --------------------------------------------------------------- */
  @ViewChild('drawer') private drawer!: MatDrawer;
  isDrawerOpen = false;
  sidenavMode: 'over' | 'side' | 'push' = 'push';

  /* View toggle state ---------------------------------------------------- */
  currentView = signal<'platform' | 'webshop'>('platform');

  switchDrawerContent(view: 'platform' | 'webshop') {
    if (this.currentView() !== view) {
      this.currentView.set(view);
    }
    if (this.drawer?.opened) this.drawer.close();
  }

  /* --------------------------------------------------------------------- */
  /*  Dummy KPI data + chart configs (unchanged)                          */
  /* --------------------------------------------------------------------- */
  totalRevenue = '$56,945';
  customers = 1092;
  avgOrderValue = '$202';
  sessions = 9285;

  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [
          2100, 3200, 4500, 5000, 6500, 7700, 8200, 9000, 10000, 12000, 14000,
          15000,
        ],
        label: 'Revenue',
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  salesCategoryChartData: ChartData<'pie', number[], string> = {
    labels: ['Apparel', 'Electronics', 'Other'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ['#0f62fe', '#6929c4', '#1192e8'],
      },
    ],
  };
  salesCategoryChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
}
