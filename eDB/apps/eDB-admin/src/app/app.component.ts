import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  UiPlatformHeaderComponent,
  UiPortalFooterComponent,
} from '@eDB/shared-ui';
import { I18nModule, PlaceholderModule } from 'carbon-components-angular';

@Component({
  selector: 'app-root',
  template: ` <div class="platform-layout">
    <ui-platform-header></ui-platform-header>
    <main class="platform-content">
      <router-outlet></router-outlet>
      <cds-placeholder></cds-placeholder>
    </main>
    <ui-portal-footer></ui-portal-footer>
  </div>`,
  imports: [
    RouterModule,
    PlaceholderModule,
    I18nModule,
    UiPlatformHeaderComponent,
    UiPortalFooterComponent,
    CommonModule,
  ],
  styleUrls: ['app.component.scss'],
})
export class AppComponent {}
