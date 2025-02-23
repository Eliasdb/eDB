import {
  ApplicationsCollectionContainer,
  UsersCollectionContainer,
} from './components';

import { Component } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page">
    <section>
      <h1 class="text-3xl mb-8">Admin</h1>
    </section>
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
