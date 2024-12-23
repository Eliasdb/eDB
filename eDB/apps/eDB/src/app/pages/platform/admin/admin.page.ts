import {
  ApplicationsCollectionContainer,
  UsersCollectionContainer,
} from '@eDB/platform-components/platform';

import { Component } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page">
    <ui-content-switcher [options]="['Users', 'Applications']">
      <ng-container section1>
        <platform-admin-users-collection></platform-admin-users-collection>
      </ng-container>
      <ng-container section2>
        <platform-admin-applications-collection></platform-admin-applications-collection>
      </ng-container>
    </ui-content-switcher>
  </section>`,
  imports: [
    UiContentSwitcherComponent,
    UsersCollectionContainer,
    ApplicationsCollectionContainer,
  ],
  styleUrls: ['admin.page.scss'],
})
export class AdminPage {}
