import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NotificationModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-toast',
  template: `
    <ng-container [ngSwitch]="type">
      <cds-toast
        *ngSwitchCase="'toast'"
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          caption: caption,
          showClose: showClose
        }"
      ></cds-toast>

      <cds-notification
        *ngSwitchCase="'notification'"
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          showClose: showClose
        }"
      ></cds-notification>

      <cds-actionable-notification
        *ngSwitchCase="'actionable-notification'"
        [notificationObj]="{
          type: notificationType,
          title: title,
          subtitle: subtitle,
          showClose: showClose
        }"
      ></cds-actionable-notification>
    </ng-container>
  `,
  imports: [NotificationModule, CommonModule],
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
