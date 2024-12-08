import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UiPortalFooterComponent,
  UiPortalHeaderComponent,
} from '@eDB/shared-ui';

@Component({
  selector: 'platform-portal-layout',
  imports: [RouterModule, UiPortalHeaderComponent, UiPortalFooterComponent],
  template: `
    <div class="auth-layout">
      <ui-portal-header></ui-portal-header>
      <main class="auth-content">
        <router-outlet></router-outlet>
      </main>
      <ui-portal-footer></ui-portal-footer>
    </div>
  `,
})
export class PortalLayout {}
