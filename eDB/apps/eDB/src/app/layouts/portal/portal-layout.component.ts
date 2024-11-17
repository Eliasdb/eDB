import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiFooterComponent, UiPortalHeaderComponent } from '@e-db/ui';

@Component({
  selector: 'platform-portal-layout',
  standalone: true,
  imports: [RouterModule, UiPortalHeaderComponent, UiFooterComponent],
  template: `
    <div class="auth-layout">
      <ui-portal-header></ui-portal-header>
      <main class="auth-content">
        <router-outlet></router-outlet>
      </main>
      <ui-footer></ui-footer>
    </div>
  `,
})
export class PortalLayoutComponent {}
