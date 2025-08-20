// libs/client-admin/src/lib/notifications-stream.service.ts
import { Injectable } from '@angular/core';
import { environment } from '@eDB/shared-env';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import type {
  NotificationDto,
  PagedNotificationsDto,
} from './notifications.service';

@Injectable({ providedIn: 'root' })
export class NotificationsStreamService {
  private hub?: HubConnection;
  private starting?: Promise<void>; // guard
  private qc = injectQueryClient();
  private handlersWired = false;

  async start() {
    if (this.hub && this.hub.state !== HubConnectionState.Disconnected) {
      // already connecting/connected; do nothing
      return;
    }
    if (this.starting) return this.starting;

    // build once
    if (!this.hub) {
      this.hub = new HubConnectionBuilder()
        .withUrl(`${environment.apiAdminStreamUrl}/hubs/notifications`, {
          // add accessTokenFactory if hub is [Authorize]
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();
    }

    // wire handlers once
    if (!this.handlersWired) {
      this.hub.onreconnecting((err) =>
        console.warn('[notif hub] reconnecting', err),
      );
      this.hub.onreconnected((id) =>
        console.info('[notif hub] reconnected', id),
      );
      this.hub.onclose((err) => console.error('[notif hub] closed', err));

      this.hub.on('NotificationCreated', (dto: NotificationDto) => {
        this.qc.setQueryData<PagedNotificationsDto>(
          ['admin-notifications', { limit: 50, cursor: null }],
          (prev) => {
            if (!prev)
              return {
                items: [dto],
                nextCursor: null,
                unreadCount: dto.read ? 0 : 1,
              };
            if (prev.items.some((n) => n.id === dto.id)) return prev;
            return {
              ...prev,
              items: [dto, ...prev.items],
              unreadCount: prev.unreadCount + (dto.read ? 0 : 1),
            };
          },
        );
        this.qc.setQueryData<{ unread: number }>(
          ['admin-notifications-unread'],
          (prev) =>
            prev ? { unread: prev.unread + (dto.read ? 0 : 1) } : prev,
        );
      });

      this.handlersWired = true;
    }

    console.info('[notif hub] starting…');
    this.starting = this.hub
      .start()
      .then(() => {
        console.info('[notif hub] started');
      })
      .finally(() => {
        this.starting = undefined;
      });

    return this.starting;
  }

  stop() {
    return this.hub?.stop();
  }
}
