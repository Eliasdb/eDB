// apps/admin/src/app/notifications/notifications-panel.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { NotificationsService } from './notifications.service'; // adjust import path

@Component({
  selector: 'edb-notifications-panel',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  template: `
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h4 class="text-xl font-semibold text-slate-950">Recent orders</h4>
        <p class="mt-1 text-sm text-slate-500">
          Live checkout events from the webshop.
        </p>
      </div>
      <button
        mat-button
        class="shrink-0"
        (click)="markAllRead()"
        [disabled]="unread() === 0"
      >
        Mark all read
        @if (unread() > 0) {
          <span>({{ unread() }})</span>
        }
      </button>
    </div>

    @if (listQuery.isLoading()) {
      <div class="text-sm text-gray-500">Loading…</div>
    } @else {
      <ul class="grid gap-3">
        @for (n of items(); track n.id) {
          <li
            class="group flex gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            [class.border-emerald-200]="!n.read"
            [class.border-slate-200]="n.read"
            [class.bg-slate-50]="n.read"
          >
            <span
              class="mt-1.5 size-3 rounded-full shadow-sm"
              [ngClass]="{
                'bg-emerald-500': n.severity === 'Success',
                'bg-blue-500': n.severity === 'Info',
                'bg-amber-500': n.severity === 'Warning',
                'bg-red-500': n.severity === 'Error',
              }"
            ></span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h5
                  class="truncate text-base font-semibold text-slate-950"
                  [class.text-slate-500]="n.read"
                >
                  {{ n.title }}
                </h5>
                <time class="text-xs font-medium text-slate-500">
                  {{ n.createdAt | date: 'medium' }}
                </time>
              </div>
              @if (n.message) {
                <div class="mt-1 text-sm text-slate-600">
                  {{ n.message }}
                </div>
              }
              <div class="mt-4 flex flex-wrap gap-2">
                @if (n.href) {
                  <button
                    type="button"
                    class="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                    (click)="openNotification(n)"
                  >
                    Open order
                  </button>
                }
                @if (!n.read) {
                  <button
                    type="button"
                    class="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    (click)="markRead(n.id)"
                  >
                    Mark read
                  </button>
                }
              </div>
            </div>
          </li>
        }
      </ul>

      <div class="mt-2 text-center">
        @if (nextCursor()) {
          <button mat-button (click)="loadMore()">Load more</button>
        }
      </div>
    }
  `,
})
export class NotificationsPanelComponent {
  private api = inject(NotificationsService);
  private qc = injectQueryClient();
  readonly openOrder = output<string>();

  // initial page
  listQuery = this.api.queryList(50, null);
  unreadQuery = this.api.queryUnreadCount();

  items = computed(() => this.listQuery.data()?.items ?? []);
  nextCursor = signal<string | null>(null);
  unread = computed(
    () =>
      this.unreadQuery.data()?.unread ??
      this.listQuery.data()?.unreadCount ??
      0,
  );

  constructor() {
    const d = this.listQuery.data();
    if (d) this.nextCursor.set(d.nextCursor);
  }

  async loadMore() {
    const cursor = this.listQuery.data()?.nextCursor;
    if (!cursor) return;
    const next = await this.api.queryList(50, cursor).refetch(); // run once manually to get next page
    // merge manually
    const prev = this.listQuery.data();
    const nextData = next.data;
    if (prev && nextData) {
      const merged = [...prev.items, ...nextData.items];
      this.qc.setQueryData(
        ['admin-notifications', { limit: 50, cursor: null }],
        () => ({
          ...prev,
          items: merged,
          nextCursor: nextData.nextCursor,
        }),
      );
      this.nextCursor.set(nextData.nextCursor);
    }
  }

  async markRead(id: string) {
    await this.api.markRead(id);
    this.unreadQuery.refetch();
  }
  async markAllRead() {
    await this.api.markAllRead();
    this.unreadQuery.refetch();
  }

  async openNotification(notification: { id: string; href?: string }) {
    const orderId = this.extractOrderId(notification.href);
    if (!orderId) return;

    if (!this.items().find((n) => n.id === notification.id)?.read) {
      await this.markRead(notification.id);
    }
    this.openOrder.emit(orderId);
  }

  private extractOrderId(href?: string): string | null {
    if (!href) return null;
    const match = href.match(/\/orders\/([^/?#]+)/);
    return match?.[1] ?? null;
  }
}
