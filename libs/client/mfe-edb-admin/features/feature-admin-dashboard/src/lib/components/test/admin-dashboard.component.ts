// ─────────────────────────────────────────────────────────────
// admin-dashboard.component.ts   (breadcrumb text animation 🌀)
// ─────────────────────────────────────────────────────────────
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { TilesModule } from 'carbon-components-angular';

import { ApplicationsCollectionContainer } from '../platform/applications-collection/applications-collection.container';
import { UsersCollectionContainer } from '../platform/users-collection/users-collection.container';
import { NotificationsPanelComponent } from '../signalr/notifications-panel.component';
import { NotificationsStreamService } from '../signalr/orders-stream.service';
import { WebshopBooksTableComponent } from '../webshop/books-table/books-table.component';
import { AdminOrdersListComponent } from '../webshop/order-collection/order.collection';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  standalone: true,
  selector: 'edb-admin-dashboard',
  imports: [
    MatDrawerContent,
    MatDrawerContainer,
    MatDrawer,
    MatSidenavModule,
    TilesModule,
    AdminSidebarComponent,
    MatIconModule,
    MatButtonModule,
    UsersCollectionContainer,
    ApplicationsCollectionContainer,
    WebshopBooksTableComponent,
    AdminOrdersListComponent,
    TitleCasePipe,
    NotificationsPanelComponent,
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
        <edb-admin-sidebar
          [isOpen]="drawer.opened"
          (toggleSidebar)="drawer.toggle()"
          (itemSelected)="switchDrawerContent($event)"
        ></edb-admin-sidebar>
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

            <!-- 🌀 Animated section title (swap + animate.enter/leave) -->
            <span class="crumb-3d">
              @if (currentView() === 'platform') {
                <span
                  class="crumb-flip inline-block text-gray-700 font-medium origin-top"
                >
                  {{ 'platform' | titlecase }}
                </span>
              } @else {
                <span
                  class="crumb-flip inline-block text-gray-700 font-medium origin-top"
                >
                  {{ 'webshop' | titlecase }}
                </span>
              }
            </span>
          </div>

          @if (currentView() === 'platform') {
            <div class="p-6">
              <h2 class="mb-4 text-2xl font-medium">Platform Administration</h2>
              <cds-tile class="flex-1 border rounded-[0.375rem] p-4 mb-4">
                <edb-notifications-panel
                  (openOrder)="openOrder($event)"
                ></edb-notifications-panel>
              </cds-tile>

              <cds-tile class="border rounded-[0.375rem] p-4 mb-4">
                <platform-admin-applications-collection></platform-admin-applications-collection>
              </cds-tile>

              <cds-tile class="border rounded-[0.375rem] p-4">
                <platform-admin-users-collection></platform-admin-users-collection>
              </cds-tile>
            </div>
          }
          @if (currentView() === 'webshop') {
            <section class="p-6">
              <h2 class="mb-4 text-2xl font-medium">Webshop Management</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Books Table -->
                <cds-tile class="border rounded-[0.375rem] p-4 col-span-1">
                  <h4 class="mb-4 text-lg font-medium">Books</h4>
                  <div class="max-h-[28rem] overflow-y-auto pr-2">
                    <webshop-books-table />
                  </div>
                </cds-tile>

                <!-- Orders -->
                <cds-tile class="border rounded-[0.375rem] p-4 col-span-1">
                  <h4 class="mb-4 text-lg font-medium">Orders</h4>
                  <div class="max-h-[28rem] overflow-y-auto pr-2">
                    <edb-admin-orders-list
                      [selectedOrderId]="selectedOrderId()"
                    />
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
export class AdminDashboardComponent implements OnInit {
  /* Drawer */
  @ViewChild('drawer') private drawer!: MatDrawer;
  isDrawerOpen = false;
  sidenavMode: 'over' | 'side' | 'push' = 'push';

  /* View toggle state */
  currentView = signal<'platform' | 'webshop'>('platform');
  selectedOrderId = signal<string | null>(null);

  private notifStream = inject(NotificationsStreamService);
  ngOnInit() {
    this.notifStream.start();
  }

  switchDrawerContent(view: 'platform' | 'webshop') {
    if (this.currentView() !== view) {
      this.currentView.set(view);
    }
    if (this.drawer?.opened) this.drawer.close();
  }

  openOrder(orderId: string) {
    this.selectedOrderId.set(orderId);
    this.currentView.set('webshop');
  }
}
