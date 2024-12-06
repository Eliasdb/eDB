import { Component, Input } from '@angular/core';
import { NotificationModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-toast',
  template: `
    @if (type === 'toast') {
      <cds-toast
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          caption: caption,
          showClose: showClose,
        }"
      ></cds-toast>
    }

    @if (type === 'notification') {
      <cds-notification
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          showClose: showClose,
        }"
      ></cds-notification>
    }

    @if (type === 'actionable-notification') {
      <cds-actionable-notification
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          showClose: showClose,
        }"
      ></cds-actionable-notification>
    }
  `,
  imports: [NotificationModule],
  styles: [],
  standalone: true,
})
export class UiNotificationToastComponent {
  @Input() type: 'toast' | 'notification' | 'actionable-notification' = 'toast';
  @Input() notificationType: 'error' | 'warning' | 'success' | 'info' = 'info';
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default Subtitle';
  @Input() caption: string = 'Default Caption';
  @Input() showClose: boolean = true;
}
