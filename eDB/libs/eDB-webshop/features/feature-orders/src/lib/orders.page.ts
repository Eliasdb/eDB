import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Order } from '@eDB-webshop/shared-types';
import { OrderService } from '@edb-webshop/client-orders';

@Component({
  selector: 'order-tracking-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen text-black mt-40">
      <div class="max-w-4xl mx-auto">
        <!-- Page title -->
        <header class="mb-10">
          <h1 class="text-4xl font-extrabold mb-2">Your Orders</h1>
          <p class="text-gray-700 text-sm max-w-md">
            Track your recent purchases, view order details, and check the
            status of each delivery.
          </p>
        </header>

        <!-- Data / loading / error states -->
        <ng-container *ngIf="orders$(); else loading">
          <ng-container *ngIf="orders$() as orders; else error">
            @for (order of orders; track order.id) {
              <div
                class="border border-white/10 rounded-2xl bg-gray-900 text-white p-6 mb-8 shadow-lg"
              >
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>
                    <p class="text-sm opacity-70">Placed on {{ order.date }}</p>
                  </div>

                  <div
                    class="text-sm px-3 py-1 rounded-full font-medium"
                    [ngClass]="statusColor(order.status)"
                  >
                    {{ order.status | titlecase }}
                  </div>
                </div>

                <div class="divide-y divide-white/10">
                  @for (item of order.items; track item.name) {
                    <div class="flex items-center justify-between py-3">
                      <div>
                        <p class="font-medium">{{ item.name }}</p>
                        <p class="text-sm opacity-70">
                          Qty: {{ item.quantity }}
                        </p>
                      </div>
                      <p class="font-semibold">
                        {{ item.price | currency: 'EUR' }}
                      </p>
                    </div>
                  }
                </div>

                <div class="flex justify-end mt-4 text-lg font-bold">
                  Total: {{ order.total | currency: 'EUR' }}
                </div>
              </div>
            }
          </ng-container>
        </ng-container>

        <ng-template #loading>
          <p>Loading orders…</p>
        </ng-template>

        <ng-template #error>
          <p class="text-red-500">
            Sorry, we couldn’t load your orders. Please try again later.
          </p>
        </ng-template>
      </div>
    </div>
  `,
})
export class OrderTrackingPageComponent {
  /** Signal that always contains the latest mapped orders list. */
  orderService = inject(OrderService);
  readonly orders$ = computed(() => this.orderService.ordersQuery.data());

  statusColor(status: Order['status']) {
    return {
      'bg-yellow-600 text-black': status === 'pending',
      'bg-blue-600 text-white': status === 'processing',
      'bg-purple-600 text-white': status === 'shipped',
      'bg-green-600 text-white': status === 'delivered',
      'bg-red-600 text-white': status === 'cancelled',
    };
  }
}
