// libs/client-admin/src/lib/notifications.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';

export type NotificationSeverity = 'Info' | 'Success' | 'Warning' | 'Error';
export type NotificationDto = {
  id: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  message?: string;
  href?: string;
  createdAt: string; // ISO
  read: boolean;
};
export type PagedNotificationsDto = {
  items: NotificationDto[];
  nextCursor: string | null;
  unreadCount: number;
};

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private qc = injectQueryClient();

  queryList(limit = 50, cursor?: string | null) {
    return injectQuery(() => ({
      queryKey: ['admin-notifications', { limit, cursor }],
      queryFn: async () => {
        let params = new HttpParams().set('limit', limit);
        if (cursor) params = params.set('cursor', cursor);
        return this.http
          .get<PagedNotificationsDto>(
            `${environment.apiAdminStreamUrl}/signalr/notifications`,
            { params },
          )
          .toPromise();
      },
      refetchOnWindowFocus: false,
    }));
  }

  queryUnreadCount() {
    return injectQuery(() => ({
      queryKey: ['admin-notifications-unread'],
      queryFn: async () =>
        this.http
          .get<{
            unread: number;
          }>(
            `${environment.apiAdminStreamUrl}/signalr/notifications/unread-count`,
          )
          .toPromise(),
      refetchOnWindowFocus: false,
    }));
  }

  async markRead(id: string) {
    await this.http
      .post(
        `${environment.apiAdminStreamUrl}/signalr/notifications/${id}/read`,
        {},
      )
      .toPromise();
    // optimistic cache update
    this.qc.setQueryData<PagedNotificationsDto>(
      ['admin-notifications', { limit: 50, cursor: null }],
      (prev) => {
        if (!prev) return prev as any;
        const items = prev.items.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        const unreadCount = Math.max(
          0,
          prev.unreadCount -
            (prev.items.find((n) => n.id === id && !n.read) ? 1 : 0),
        );
        return { ...prev, items, unreadCount };
      },
    );
    this.qc.setQueryData<{ unread: number }>(
      ['admin-notifications-unread'],
      (prev) => (prev ? { unread: Math.max(0, prev.unread - 1) } : prev),
    );
  }

  async markAllRead() {
    await this.http
      .post(
        `${environment.apiAdminStreamUrl}/signalr/notifications/mark-all-read`,
        {},
      )
      .toPromise();
    this.qc.setQueryData<PagedNotificationsDto>(
      ['admin-notifications', { limit: 50, cursor: null }],
      (prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((n) => ({ ...n, read: true })),
              unreadCount: 0,
            }
          : prev,
    );
    this.qc.setQueryData<{ unread: number }>(['admin-notifications-unread'], {
      unread: 0,
    });
  }
}
