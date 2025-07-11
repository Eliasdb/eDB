// ─────────────────────────────────────────────────────────────
// order-tracking.component.ts — With title and subtitle
// ─────────────────────────────────────────────────────────────
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

@Component({
  standalone: true,
  selector: 'order-tracking-page',
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen text-white mt-40">
      <div class="max-w-4xl mx-auto">
        <!-- Page Title -->
        <header class="mb-10">
          <h1 class="text-4xl font-extrabold text-black mb-2">Your Orders</h1>
          <p class="text-gray-700 text-sm max-w-md">
            Track your recent purchases, view order details, and check the
            status of each delivery.
          </p>
        </header>

        <!-- Orders -->
        @for (order of orders; track order.id) {
          <div
            class="border border-white/10 rounded-2xl bg-gray-900 p-6 mb-8 shadow-lg"
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
                    <p class="text-sm opacity-70">Qty: {{ item.quantity }}</p>
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
      </div>
    </div>
  `,
})
export class OrderTrackingPageComponent {
  orders: Order[] = [
    {
      id: 'ORD-20250710-01',
      date: 'July 9, 2025',
      status: 'pending',
      total: 122.49,
      items: [
        { name: 'The Pragmatic Programmer', quantity: 1, price: 47.5 },
        { name: 'Clean Code', quantity: 1, price: 74.99 },
      ],
    },
    {
      id: 'ORD-20250709-22',
      date: 'July 8, 2025',
      status: 'delivered',
      total: 65.0,
      items: [{ name: "You Don't Know JS Yet", quantity: 1, price: 65.0 }],
    },
  ];

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
