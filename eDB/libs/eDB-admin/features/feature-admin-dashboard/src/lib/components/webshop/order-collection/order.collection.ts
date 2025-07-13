import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Order } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';

@Component({
  selector: 'admin-orders-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="p-6 bg-slate-50 min-h-screen text-black">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <header class="mb-10">
          <h1 class="text-4xl font-extrabold mb-2">All Orders</h1>
          <p class="text-gray-700 text-sm max-w-lg">
            Overview of all placed orders across customers.
          </p>
        </header>

        <!-- Order list -->
        <ng-container *ngIf="orders(); else loading">
          <ng-container *ngIf="orders() as list; else error">
            @for (order of list; track order.id) {
              <article
                class="border border-slate-200 rounded-2xl bg-white text-slate-800 p-6 mb-6 shadow-sm"
              >
                <!-- Top: Order meta -->
                <header class="flex justify-between items-start mb-4">
                  <div>
                    <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>
                    <p class="text-sm text-gray-500">
                      Placed: {{ order.date }}
                    </p>
                    @if (order.fullName && order.email) {
                      <p class="text-sm text-gray-500">
                        Customer: {{ order.fullName }} ({{ order.email }})
                      </p>
                    }
                  </div>
                  <span
                    class="text-sm px-3 py-1 rounded-full font-medium whitespace-nowrap"
                    [ngClass]="statusColor(order.status)"
                  >
                    {{ order.status | titlecase }}
                  </span>
                </header>

                <!-- Address -->
                <div
                  class="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-inner"
                >
                  <p class="text-sm font-semibold mb-1 text-slate-700">
                    Shipping Address
                  </p>
                  <p class="text-sm text-slate-600">
                    {{ order.fullName }}<br />
                    {{ order.address }}<br />
                    {{ order.postalCode }} {{ order.city }}
                  </p>
                </div>

                <!-- Items list -->
                <section class="divide-y divide-slate-200">
                  @for (item of order.items; track item.name) {
                    <div class="flex items-center justify-between py-3">
                      <div>
                        <p class="font-medium">{{ item.name }}</p>
                        <p class="text-sm text-gray-500">
                          Qty: {{ item.quantity }}
                        </p>
                      </div>
                      <p class="font-semibold">
                        {{ item.price | currency: 'EUR' }}
                      </p>
                    </div>
                  }
                </section>

                <!-- Total -->
                <footer class="flex justify-end mt-4 text-lg font-bold">
                  Total: {{ order.total | currency: 'EUR' }}
                </footer>
              </article>
            }
          </ng-container>
        </ng-container>

        <!-- Loading -->
        <ng-template #loading>
          <p class="text-sm text-gray-500">Loading orders…</p>
        </ng-template>

        <!-- Error -->
        <ng-template #error>
          <p class="text-sm text-red-600">
            Could not load orders. Please try again later.
          </p>
        </ng-template>
      </div>
    </section>
  `,
})
export class AdminOrdersListComponent {
  private readonly adminService = inject(AdminService);
  readonly ordersQuery = this.adminService.queryAllOrders();
  readonly orders = computed(() => this.ordersQuery.data() ?? []);

  statusColor(status: Order['status']) {
    return {
      'bg-yellow-100 text-yellow-800': status === 'pending',
      'bg-blue-100 text-blue-800': status === 'processing',
      'bg-purple-100 text-purple-800': status === 'shipped',
      'bg-green-100 text-green-800': status === 'delivered',
      'bg-red-100 text-red-800': status === 'cancelled',
    };
  }
}
