import { CurrencyPipe, NgClass, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { OrderService } from '@edb/client-orders';
import { Order } from '@edb/shared-types';

@Component({
  selector: 'webshop-order-tracking-page',
  standalone: true,
  imports: [NgClass, CurrencyPipe, TitleCasePipe],
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
        @if (orders$(); as orders) {
          @if (orders.length > 0) {
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
          } @else {
            <p>No orders found.</p>
          }
        } @else {
          @if (orderService.ordersQuery.isLoading()) {
            <p>Loading orders…</p>
          } @else if (orderService.ordersQuery.isError()) {
            <p class="text-red-500">
              Sorry, we couldn’t load your orders. Please try again later.
            </p>
          }
        }
      </div>
    </div>
  `,
})
export class OrderTrackingPageComponent {
  readonly orderService = inject(OrderService);
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
