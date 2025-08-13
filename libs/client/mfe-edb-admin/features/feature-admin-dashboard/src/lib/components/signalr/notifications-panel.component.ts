// apps/admin/src/app/notifications/notifications-panel.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NotificationsService } from './notifications.service'; // adjust import path

@Component({
  selector: 'notifications-panel',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  template: `
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-lg font-medium">Notifications</h4>
      <button mat-button (click)="markAllRead()" [disabled]="unread() === 0">
        Mark all read ({{ unread() }})
      </button>
    </div>

    <div
      *ngIf="listQuery.isLoading(); else content"
      class="text-sm text-gray-500"
    >
      Loading…
    </div>
    <ng-template #content>
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
              <div class="text-xs text-slate-600" *ngIf="n.message">
                {{ n.message }}
              </div>
              <div class="text-[11px] text-slate-500 mt-1">
                {{ n.createdAt | date: 'short' }}
              </div>
              <div class="mt-1 flex gap-2">
                <a
                  *ngIf="n.href"
                  class="text-xs underline"
                  [href]="n.href"
                  target="_blank"
                  rel="noreferrer"
                  >Open</a
                >
                <button
                  class="text-xs underline"
                  (click)="markRead(n.id)"
                  *ngIf="!n.read"
                >
                  Mark read
                </button>
              </div>
            </div>
          </li>
        }
      </ul>

      <div class="mt-2 text-center">
        <button mat-button (click)="loadMore()" *ngIf="nextCursor()">
          Load more
        </button>
      </div>
    </ng-template>
  `,
})
export class NotificationsPanelComponent {
  private api = inject(NotificationsService);

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
    if (prev && next.data) {
      const merged = [...prev.items, ...next.data.items];
      (this.listQuery as any).setData({
        ...prev,
        items: merged,
        nextCursor: next.data.nextCursor,
      });
      this.nextCursor.set(next.data.nextCursor);
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
