import { Component, input } from '@angular/core';
import { NotificationModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-toast',
  imports: [NotificationModule],
  template: `
    @if (type() === 'toast') {
      <cds-toast
        [notificationObj]="{
          type: notificationType(),
          title: title(),
          subtitle: subtitle(),
          caption: caption(),
          showClose: showClose(),
        }"
      ></cds-toast>
    }

    @if (type() === 'notification') {
      <cds-notification
        [notificationObj]="{
          type: notificationType(),
          title: title(),
          message: subtitle(),
          showClose: showClose(),
        }"
      ></cds-notification>
    }

    @if (type() === 'actionable-notification') {
      <cds-actionable-notification
        [notificationObj]="{
          type: notificationType(),
          title: title(),
          message: subtitle(),
          showClose: showClose(),
        }"
      ></cds-actionable-notification>
    }
  `,

  styleUrls: ['./notification-toast.component.scss'],
})
export class UiNotificationToastComponent {
  readonly type = input<'toast' | 'notification' | 'actionable-notification'>(
    'toast',
  );
  readonly notificationType = input<'error' | 'warning' | 'success' | 'info'>(
    'info',
  );
  readonly title = input<string>('Default Title');
  readonly subtitle = input<string>('Default Subtitle');
  readonly caption = input<string>('Default Caption');
  readonly showClose = input<boolean>(true);
}
