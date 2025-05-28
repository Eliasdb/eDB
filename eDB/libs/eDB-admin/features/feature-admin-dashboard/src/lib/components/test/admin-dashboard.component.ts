import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { AdminService } from '@eDB/client-admin';
import { UiTableComponent } from '@eDB/shared-ui';
import { TableUtilsService } from '@eDB/shared-utils';
import { TableModel, TilesModule } from 'carbon-components-angular';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Application } from '../../types/application-overview.type';
import { APPLICATION_TABLE_CONFIG } from '../platform/applications-collection/applications-collection.container.config';
import { UsersCollectionContainer } from '../platform/users-collection/users-collection.container';
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
    UiTableComponent,
    BaseChartDirective,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    UsersCollectionContainer,
  ],
  template: `
    <!-- Floating button to open the sidebar when closed -->

    <mat-drawer-container class="h-[calc(100dvh-5rem)] relative">
      <!-- Sidebar with dark theme styling and dynamic mode -->
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
        >
          ></admin-sidebar
        >
      </mat-drawer>

      <!-- Main Content -->
      <mat-drawer-content>
        <div class="p-4 bg-white text-black   min-h-[calc(100dvh-5rem)]">
          <div class="w-full">
            <button
              mat-icon-button
              (click)="drawer.open()"
              aria-label="Open sidebar"
              class="z-50 bg-gray-700 text-white rounded-full shadow"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>

          <ng-container *ngIf="currentView() === 'platform'">
            <h2 class="mb-4 text-2xl font-medium">Dashboard</h2>

            <!-- Metric Tiles -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <cds-tile
                class="flex-1  border border-width-2 rounded-[0.375rem] "
              >
                <h5 class="mb-1 font-light opacity-80">Total Revenue</h5>
                <h3 class="text-xl font-medium">{{ totalRevenue }}</h3>
              </cds-tile>
              <cds-tile
                class="flex-1   border border-width-2 rounded-[0.375rem]"
              >
                <h5 class="mb-1 font-light opacity-80">Customers</h5>
                <h3 class="text-xl font-medium">{{ customers }}</h3>
              </cds-tile>
              <cds-tile
                class="flex-1   border border-width-2 rounded-[0.375rem]"
              >
                <h5 class="mb-1 font-light opacity-80">Avg Order Value</h5>
                <h3 class="text-xl font-medium">{{ avgOrderValue }}</h3>
              </cds-tile>
              <cds-tile
                class="flex-1   border border-width-2 rounded-[0.375rem]"
              >
                <h5 class="mb-1 font-light opacity-80">Sessions</h5>
                <h3 class="text-xl font-medium">{{ sessions }}</h3>
              </cds-tile>
            </div>

            <!-- Charts Row -->
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <cds-tile
                class="flex-1 border border-width-2 rounded-[0.375rem] p-4 flex flex-col"
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
                class="flex-1 border border-width-2 rounded-[0.375rem] p-4 flex flex-col"
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

            <!-- Bottom Row -->
            <div class="flex flex-col md:flex-row gap-4">
              <cds-tile class="flex-1 bg-[#262626] p-4">
                <h4 class="mb-2 text-lg font-medium">Platform Applications</h4>
                <ui-table
                  [model]="tableModel"
                  [showToolbar]="false"
                  [showButton]="false"
                  [showPagination]="false"
                  [sortable]="true"
                  [showSelectionColumn]="false"
                  (rowClicked)="onRowClicked($event)"
                  (sortChanged)="onSortChanged($event)"
                ></ui-table>
              </cds-tile>
              <cds-tile class="flex-1 bg-[#262626] p-4">
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

            <div>
              <platform-admin-users-collection></platform-admin-users-collection>
            </div>
          </ng-container>

          <ng-container *ngIf="currentView() === 'webshop'">
            <h2 class="mb-4 text-2xl font-bold">Webshop Dashboard</h2>
            <cds-tile class="bg-[#262626] p-4 mb-4">
              <p>
                This is the Webshop view. You can add stats, charts, or other
                widgets here.
              </p>
            </cds-tile>
          </ng-container>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [],
  standalone: true,
})
export class AdminDashboardComponent implements OnInit {
  // Sidebar state using two-way binding
  isDrawerOpen: boolean = true;
  @ViewChild('drawer') drawer!: MatDrawer;

  // Signal to track the current view (platform or webshop)
  currentView = signal<'platform' | 'webshop'>('platform');

  // Sidebar mode, which will be dynamically set to 'over' on mobile devices and 'side' on larger screens.
  sidenavMode: 'over' | 'side' = 'side';

  // Inject BreakpointObserver to handle responsive changes
  private breakpointObserver = inject(BreakpointObserver);

  switchDrawerContent(newContent: 'platform' | 'webshop') {
    console.log(`Switching view to: ${newContent}`);
    this.currentView.set(newContent);
    // Close the drawer when switching content if open
    if (this.sidenavMode === 'over' && this.drawer.opened) {
      this.drawer.close();
    }
  }

  // Metric tiles values
  totalRevenue: string = '$56,945';
  customers: number = 1092;
  avgOrderValue: string = '$202';
  sessions: number = 9285;

  // REVENUE (Line Chart)
  public revenueChartData: ChartConfiguration<'line'>['data'] = {
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

  public revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // SALES BY CATEGORY (Pie Chart)
  public salesCategoryChartData: ChartData<'pie', number[], string> = {
    labels: ['Apparel', 'Electronics', 'Other'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ['#0f62fe', '#6929c4', '#1192e8'],
      },
    ],
  };

  public salesCategoryChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Table model for displaying platform applications
  tableModel: TableModel = new TableModel();

  // Inject AdminService and TableUtilsService to query applications data
  adminService = inject(AdminService);
  tableUtils = inject(TableUtilsService);

  // Query applications data from AdminService
  private applicationsQuery = this.adminService.queryApplications();
  applications = computed(() => this.applicationsQuery.data() || []);

  constructor() {
    // Set up an effect that runs whenever the applications data changes
    effect(() => {
      const apps = this.applications();
      if (apps && apps.length > 0) {
        this.initializeApplicationsTable(apps);
      } else {
        this.clearApplicationsTable();
      }
    });

    // Use BreakpointObserver to dynamically adjust the sidebar mode:
    // If the screen matches handset (mobile) breakpoints, set mode to 'over' and close the drawer.
    // Otherwise, use 'side' mode and keep the drawer open.
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.sidenavMode = 'over';
          this.isDrawerOpen = false;
        } else {
          this.sidenavMode = 'side';
          this.isDrawerOpen = true;
        }
      });
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  initializeApplicationsTable(applications: Application[]): void {
    this.tableModel.header = APPLICATION_TABLE_CONFIG.headers;
    this.tableModel.data = this.tableUtils.createExpandedData(
      applications,
      APPLICATION_TABLE_CONFIG,
    );
  }

  clearApplicationsTable(): void {
    this.tableModel.data = [];
  }

  onRowClicked(event: any): void {
    console.log('Row clicked:', event);
  }

  onSortChanged(event: any): void {
    console.log('Sort changed:', event);
  }
}
