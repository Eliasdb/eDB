import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@eDB/shared-ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';
import { SettingsGroup } from '../../../models/settings.model';
import { LinkItem } from '../../../models/user.model';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';
import { settingsGroups } from './settings-data';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [
    CommonModule,
    UiSidenavComponent,
    UiTitleComponent,
    SettingsGroupComponent,
  ],
  template: `
    <section class="settings-page">
      <section class="sidenav">
        <ui-title text="Profile" class="profile-title"></ui-title>
        <ui-sidenav
          [links]="links"
          (linkClick)="onLinkClick($event)"
        ></ui-sidenav>
      </section>
      <section class="settings-container" #settingsContainer>
        <ng-container
          *ngFor="let group of settingsGroups; trackBy: trackByGroupId"
        >
          <platform-settings-group
            [id]="group.id"
            [header]="group.header"
            [headerIcon]="group.headerIcon"
            [rows]="computedRows[group.id]()"
            (rowUpdated)="onRowUpdated($event)"
          ></platform-settings-group>
        </ng-container>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer {
  settingsGroups = settingsGroups;

  links: LinkItem[] = this.settingsGroups.map((group) => ({
    id: group.id,
    label: group.header,
    icon: group.headerIcon,
    active: false,
  }));

  computedRows: { [groupId: string]: Signal<[string, string][]> } = {};

  // Private properties
  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();
  private updateUserProfileMutation =
    this.userProfileService.updateUserProfile();

  constructor() {
    this.initializeComputedRows();
  }

  // Lifecycle hooks
  // If additional initialization is needed, consider implementing OnInit

  // Public methods
  onRowUpdated({ field, value }: { field: string; value: string }): void {
    const row = this.settingsGroups
      .flatMap((group) => group.rows)
      .find((row) => row.label === field);

    if (!row || !row.payloadKey) {
      console.error(`Unknown field: ${field}`);
      return;
    }

    const payload = { [row.payloadKey]: value };

    this.updateUserProfileMutation
      .mutateAsync(payload)
      .then(() => this.userProfileQuery.refetch())
      .catch((err) => console.error('Failed to update user profile:', err));
  }

  onLinkClick(clickedItem: LinkItem): void {
    this.links.forEach((link) => (link.active = link.id === clickedItem.id));
    this.scrollToSection(clickedItem.id);
  }

  trackByGroupId(_: number, group: SettingsGroup): string {
    return group.id;
  }

  // Private methods
  private initializeComputedRows(): void {
    this.settingsGroups.forEach((group) => {
      this.computedRows[group.id] = computed(() => this.computeRows(group));
    });
  }

  private computeRows(group: SettingsGroup): [string, string][] {
    const profile = this.userProfileQuery.data();
    return group.rows.map((row) => [row.label, row.getValue(profile) ?? '']);
  }

  private scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id '${id}' not found.`);
    }
  }
}
