// admin-orders-list.component.ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Order } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';

@Component({
  selector: 'admin-orders-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="sm:p-4 md:p-6 text-black">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- header (kept minimal on mobile) -->
        <header *ngIf="!isMobile()" class="mb-2">
          <p class="text-gray-600 text-sm">Overview of all customer orders.</p>
        </header>

        <!-- loading / error -->
        <ng-container *ngIf="orders(); else loading">
          <ng-container *ngIf="orders() as list; else error">
            @for (order of list; track order.id) {
              <!-- ===== MOBILE PILL ===== -->
              <ng-container *ngIf="isMobile(); else desktopCard">
                <div
                  (click)="toggle(order.id)"
                  class="group relative flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition
         hover:shadow-md active:bg-slate-50 cursor-pointer"
                >
                  <!-- left colour strip – now flush top & bottom -->
                  <span
                    class="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                    [ngClass]="statusAccent(order.status)"
                  ></span>

                  <!-- id + date -->
                  <div class="pl-4 flex-1">
                    <p
                      class="font-medium text-sm text-gray-900 leading-none group-active:opacity-80"
                    >
                      #{{ order.id.slice(0, 8) }}…
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ order.date }}
                    </p>
                  </div>

                  <!-- total -->
                  <p class="text-sm font-semibold whitespace-nowrap">
                    {{ order.total | currency: 'EUR' : 'symbol' : '1.0-0' }}
                  </p>

                  <!-- status badge -->
                  <span
                    class="text-[11px] px-2 py-0.5 rounded-full font-medium border capitalize tracking-wide"
                    [ngClass]="statusBadge(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </div>

                <!-- accordion details -->
                <div
                  *ngIf="open(order.id)"
                  class="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs space-y-3"
                >
                  <!-- shipping -->
                  <div>
                    <p class="font-semibold mb-0.5">Shipping</p>
                    <address class="not-italic leading-snug text-gray-600">
                      {{ order.fullName }}<br />
                      {{ order.address }}<br />
                      {{ order.postalCode }} {{ order.city }}
                    </address>
                  </div>

                  <!-- items -->
                  <div class="divide-y divide-slate-100">
                    @for (item of order.items; track item.name) {
                      <div class="flex justify-between py-1">
                        <span>{{ item.name }} (×{{ item.quantity }})</span>
                        <span>{{
                          item.price | currency: 'EUR' : undefined : '1.0-0'
                        }}</span>
                      </div>
                    }
                  </div>
                </div>
              </ng-container>

              <!-- ===== DESKTOP CARD ===== -->
              <ng-template #desktopCard>
                <!-- (your current desktop article, unchanged) -->
                <article
                  class="relative border border-slate-200 rounded-xl bg-white p-5 md:p-6 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-slate-300"
                >
                  <!-- colored accent -->
                  <span
                    class="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                    [ngClass]="statusAccent(order.status)"
                  ></span>

                  <!-- header -->
                  <div class="flex justify-between mb-4">
                    <div>
                      <p class="font-semibold text-sm text-gray-700">
                        Order <span class="break-all">#{{ order.id }}</span>
                      </p>
                      <p class="text-sm text-gray-500">{{ order.date }}</p>
                      <p class="text-sm text-gray-500">
                        {{ order.fullName }}
                        <span *ngIf="order.email">({{ order.email }})</span>
                      </p>
                    </div>

                    <span
                      class="self-start text-xs px-2 py-0.5 rounded-full font-medium border"
                      [ngClass]="statusBadge(order.status)"
                    >
                      {{ order.status | titlecase }}
                    </span>
                  </div>

                  <!-- shipping + total -->
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-md p-4 text-sm"
                  >
                    <div>
                      <p class="font-semibold mb-1">Shipping</p>
                      <address class="not-italic text-gray-600 leading-snug">
                        {{ order.fullName }}<br />
                        {{ order.address }}<br />
                        {{ order.postalCode }} {{ order.city }}
                      </address>
                    </div>
                    <div class="sm:text-right">
                      <p class="font-semibold mb-1 text-gray-800">Total</p>
                      <p class="text-base font-semibold">
                        {{ order.total | currency: 'EUR' }}
                      </p>
                    </div>
                  </div>

                  <!-- items -->
                  <div class="mt-3 divide-y divide-slate-100 text-sm">
                    @for (item of order.items; track item.name) {
                      <div class="flex justify-between py-2">
                        <span>{{ item.name }} (×{{ item.quantity }})</span>
                        <span>{{ item.price | currency: 'EUR' }}</span>
                      </div>
                    }
                  </div>
                </article>
              </ng-template>
            }
          </ng-container>
        </ng-container>

        <ng-template #loading>
          <p class="text-sm text-gray-500">Loading orders…</p>
        </ng-template>

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
  /* ───────── data ───────── */
  private readonly admin = inject(AdminService);
  readonly ordersQuery = this.admin.queryAllOrders();
  readonly orders = computed(() => this.ordersQuery.data() ?? []);

  /* ───────── breakpoint ───────── */
  private readonly bp = inject(BreakpointObserver);
  readonly isMobile = signal(false);

  constructor() {
    effect(() => {
      this.bp
        .observe('(max-width: 767px)')
        .subscribe((r) => this.isMobile.set(r.matches));
    });
  }

  /* ───────── accordion state (mobile) ───────── */
  private opened = new Set<string | number>();
  toggle(id: string | number) {
    this.opened.has(id) ? this.opened.delete(id) : this.opened.add(id);
  }
  open(id: string | number) {
    return this.opened.has(id);
  }

  /* ───────── visual helpers ───────── */
  statusAccent(status: Order['status']) {
    return {
      'bg-[var(--accent-complimentary)]': status === 'pending',
      'bg-blue-500': status === 'processing',
      'bg-purple-500': status === 'shipped',
      'bg-green-500': status === 'delivered',
      'bg-red-500': status === 'cancelled',
    };
  }
  statusBadge(status: Order['status']) {
    return {
      'bg-yellow-100 text-yellow-800 border-yellow-200': status === 'pending',
      'bg-blue-100 text-blue-800 border-blue-200': status === 'processing',
      'bg-purple-100 text-purple-800 border-purple-200': status === 'shipped',
      'bg-green-100 text-green-800 border-green-200': status === 'delivered',
      'bg-red-100 text-red-800 border-red-200': status === 'cancelled',
    };
  }
}
