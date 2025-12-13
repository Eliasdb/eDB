// apps/admin/src/app/notifications/notifications-panel.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { NotificationsService } from './notifications.service'; // adjust import path

@Component({
  selector: 'edb-notifications-panel',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  template: `
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-lg font-medium">Notifications</h4>
      <button mat-button (click)="markAllRead()" [disabled]="unread() === 0">
        Mark all read ({{ unread() }})
      </button>
    </div>

    @if (listQuery.isLoading()) {
      <div class="text-sm text-gray-500">Loading…</div>
    } @else {
      <ul class="divide-y rounded border bg-white">
        @for (n of items(); track n.id) {
          <li class="p-3 flex gap-3 hover:bg-slate-50">
            <span
              class="mt-1 size-2 rounded-full"
              [ngClass]="{
                'bg-emerald-500': n.severity === 'Success',
                'bg-blue-500': n.severity === 'Info',
                'bg-amber-500': n.severity === 'Warning',
                'bg-red-500': n.severity === 'Error',
              }"
            ></span>

            <div class="flex-1">
              <div class="text-sm font-medium" [class.opacity-60]="n.read">
                {{ n.title }}
              </div>
              @if (n.message) {
                <div class="text-xs text-slate-600">
                  {{ n.message }}
                </div>
              }
              <div class="text-[11px] text-slate-500 mt-1">
                {{ n.createdAt | date: 'short' }}
              </div>
              <div class="mt-1 flex gap-2">
                @if (n.href) {
                  <a
                    class="text-xs underline"
                    [href]="n.href"
                    target="_blank"
                    rel="noreferrer"
                    >Open</a
                  >
                }
                @if (!n.read) {
                  <button class="text-xs underline" (click)="markRead(n.id)">
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
      this.qc.setQueryData(['admin-notifications', { limit: 50, cursor: null }], () => ({
        ...prev,
        items: merged,
        nextCursor: nextData.nextCursor,
      }));
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
}
