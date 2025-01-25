import {
  ApplicationsCollectionContainer,
  UsersCollectionContainer,
} from './components';

import { Component } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { UiButtonComponent } from '../../../ui/src/lib/components/buttons/button/button.component';

@Component({
  selector: 'platform-admin',
  template: ` <section class="admin-page">
    <section>
      Temp button: <ui-button><a href="">To web app!</a></ui-button>
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
    UiButtonComponent,
  ],
  styleUrls: ['admin.page.scss'],
})
export class AdminPage {}
