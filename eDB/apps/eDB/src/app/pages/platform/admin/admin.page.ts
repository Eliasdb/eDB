import { Component } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { ApplicationsCollectionContainer } from '../../../components/platform/admin/applications-collection/applications-collection.container';
import { UsersCollectionContainer } from '../../../components/platform/admin/users-collection/users-collection.container';

@Component({
  selector: 'platform-admin',
  standalone: true,
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
