import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@eDB/shared-ui';
import { IconModule, NotificationService } from 'carbon-components-angular';

@Component({
  selector: 'platform-not-found-page',
  template: `
    <div class="not-found">
      <h1>404</h1>
      <img
        src="https://i.ibb.co/sqv5Cp2/undraw-void-3ggu.png"
        width="400px"
        alt=""
      />
      <p>The page you are looking for isn't here.</p>

      <ui-button
        variant="secondary"
        size="lg"
        icon="faHome"
        (buttonClick)="navigateToDashboard()"
      >
        Back to dashboard
      </ui-button>

      <ui-button
        variant="primary"
        size="lg"
        icon="faInfoCircle"
        (buttonClick)="showTestToast()"
      >
        Show Test Toast
      </ui-button>
      <div class="notification-container"></div>
    </div>
  `,
  standalone: true,
  imports: [UiButtonComponent, IconModule],
  styles: [
    `
      .not-found {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      h1 {
        font-size: 5rem;
        font-weight: 400;
      }
      p {
        font-size: 1.6rem;
        text-align: center;
      }
      ui-button {
        margin-top: 20px;
      }
    `,
  ],
})
export class NotFoundPage {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  showTestToast(): void {
    this.notificationService.showToast({
      type: 'info',
      title: 'Sample toast',
      subtitle: 'Sample subtitle message',
      caption: 'Sample caption',
      // target: '.notification-container',
      message: 'message',
      duration: 5000,
      smart: true,
    });
  }
}
