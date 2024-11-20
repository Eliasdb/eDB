import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@e-db/ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';
import { LinkItem, UserProfile } from '../../../models/user.model';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';

interface SettingsRow {
  label: string;
  payloadKey: string;
  getValue: (profile?: UserProfile) => string;
}

interface SettingsGroup {
  id: string;
  header: string;
  headerIcon: string;
  rows: SettingsRow[];
}

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [
    UiSidenavComponent,
    UiTitleComponent,
    SettingsGroupComponent,
    CommonModule,
  ],
  template: `
    <section class="settings-page">
      <section class="sidenav">
        <ui-title text="Profile" className="profile-title"></ui-title>
        <ui-sidenav
          [links]="links"
          (linkClick)="onLinkClick($event)"
        ></ui-sidenav>
      </section>
      <section class="settings-container" #settingsContainer>
        <ng-container *ngFor="let group of settingsGroups">
          <platform-settings-group
            [id]="group.id"
            [header]="group.header"
            [headerIcon]="group.headerIcon"
            [rows]="getRows(group)"
            [skeleton]="isLoading()"
            (rowUpdated)="onRowUpdated($event)"
          ></platform-settings-group>
        </ng-container>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer {
  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();
  private updateUserProfileMutation =
    this.userProfileService.updateUserProfile();

  isLoading = computed(
    () =>
      this.userProfileQuery.isFetching() || this.userProfileQuery.isLoading()
  );

  settingsGroups: SettingsGroup[] = [
    {
      id: 'id-and-password',
      header: 'ID and Password',
      headerIcon: 'faKey',
      rows: [
        {
          label: 'E-mail',
          payloadKey: 'email',
          getValue: (profile) => profile?.email || '',
        },
        {
          label: 'Password',
          payloadKey: 'password',
          getValue: () => '********',
        },
      ],
    },
    {
      id: 'contact-information',
      header: 'Contact Information',
      headerIcon: 'faContactCard',
      rows: [
        {
          label: 'Name',
          payloadKey: 'firstName',
          getValue: (profile) =>
            profile ? `${profile.firstName} ${profile.lastName}` : '',
        },
        {
          label: 'Display name',
          payloadKey: 'displayName',
          getValue: (profile) => profile?.displayName || 'Inactive',
        },
        {
          label: 'Email address',
          payloadKey: 'email',
          getValue: (profile) => profile?.email || '',
        },
        {
          label: 'Phone number',
          payloadKey: 'phoneNumber',
          getValue: (profile) => profile?.phoneNumber || 'Inactive',
        },
        {
          label: 'Country or region of residence',
          payloadKey: 'country',
          getValue: (profile) => profile?.country || '',
        },
        {
          label: 'Preferred language for communication',
          payloadKey: 'preferredLanguage',
          getValue: (profile) => profile?.preferredLanguage || 'Inactive',
        },
      ],
    },
    {
      id: 'company',
      header: 'Company',
      headerIcon: 'faBuilding',
      rows: [
        {
          label: 'Organization information',
          payloadKey: 'company',
          getValue: (profile) => profile?.company || '',
        },
        {
          label: 'Work information',
          payloadKey: 'title',
          getValue: (profile) => profile?.title || 'Inactive',
        },
      ],
    },
    {
      id: 'addresses',
      header: 'Addresses',
      headerIcon: 'faMapMarkerAlt',
      rows: [
        {
          label: 'Address information',
          payloadKey: 'address',
          getValue: (profile) => profile?.address || 'Inactive',
        },
      ],
    },
    {
      id: 'offboarding',
      header: 'Offboarding',
      headerIcon: 'faSignOutAlt',
      rows: [
        {
          label: 'Deactivate Account',
          payloadKey: 'deactivate',
          getValue: () => 'Click to deactivate your account',
        },
      ],
    },
  ];

  links: LinkItem[] = this.settingsGroups.map((group) => ({
    id: group.id,
    label: group.header,
    active: false,
  }));

  getRows(group: SettingsGroup): [string, string][] {
    const profile = this.userProfileQuery.data();
    return group.rows.map((row) => [row.label, row.getValue(profile)]);
  }

  onRowUpdated({ field, value }: { field: string; value: string }): void {
    let payloadKey: string | undefined;

    for (const group of this.settingsGroups) {
      const row = group.rows.find((row) => row.label === field);
      if (row) {
        payloadKey = row.payloadKey;
        break;
      }
    }

    if (!payloadKey) {
      console.error(`Unknown field: ${field}`);
      return;
    }

    this.updateUserProfileMutation
      .mutateAsync({ [payloadKey]: value })
      .catch((err) => {
        console.error('Failed to update user profile:', err);
      });
  }

  onLinkClick(clickedItem: LinkItem): void {
    this.links.forEach((link) => {
      link.active = link.id === clickedItem.id;
    });
    this.scrollToSection(clickedItem.id);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
