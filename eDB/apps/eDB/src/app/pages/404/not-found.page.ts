import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@eDB/shared-ui';

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
    </div>
  `,
  standalone: true,
  imports: [UiButtonComponent],
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
  constructor(private router: Router) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
