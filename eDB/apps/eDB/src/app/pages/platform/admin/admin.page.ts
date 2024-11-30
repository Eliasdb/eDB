import { Component } from '@angular/core';
import { UiContentSwitcherComponent } from '@eDB/shared-ui';
import { UsersCollectionContainer } from '../../../components/platform/admin/users-collection-container/users-collection.container';

@Component({
  selector: 'platform-admin-page',
  standalone: true,
  template: `
    <section class="admin-page">
      <ui-content-switcher
        [optionsArray]="['Users', 'Applications', 'Settings']"
        [activeSection]="activeSection"
        (activeSectionChange)="onSectionChange($event)"
      >
        <ng-container section1>
          <platform-admin-users-collection></platform-admin-users-collection>
        </ng-container>
        <ng-container section2>
          <!-- Include Applications Component here -->
        </ng-container>
        <ng-container section3>
          <!-- Include Settings Component here -->
        </ng-container>
      </ui-content-switcher>
    </section>
  `,
  imports: [UiContentSwitcherComponent, UsersCollectionContainer],
  styleUrl: 'admin.container.scss',
})
export class AdminPage {
  activeSection = 0;

  onSectionChange(index: number): void {
    this.activeSection = index;
  }
}
