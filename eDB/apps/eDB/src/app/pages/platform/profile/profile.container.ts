import { Component, computed, inject } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@e-db/ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';
import { LinkItem } from '../../../models/user.model';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [UiSidenavComponent, UiTitleComponent, SettingsGroupComponent],
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
        <platform-settings-group
          id="id-and-password"
          header="ID and Password"
          headerIcon="faKey"
          [rows]="idAndPasswordRows()"
          [skeleton]="isLoading()"
          (rowUpdated)="onRowUpdated($event)"
        ></platform-settings-group>

        <platform-settings-group
          id="contact-information"
          header="Contact Information"
          headerIcon="faContactCard"
          [rows]="contactInformationRows()"
          [skeleton]="isLoading()"
          (rowUpdated)="onRowUpdated($event)"
        ></platform-settings-group>

        <platform-settings-group
          id="company"
          header="Company"
          headerIcon="faBuilding"
          [rows]="companyRows()"
          [skeleton]="isLoading()"
          (rowUpdated)="onRowUpdated($event)"
        ></platform-settings-group>

        <platform-settings-group
          id="addresses"
          header="Addresses"
          headerIcon="faKey"
          [rows]="addressesRows()"
          [skeleton]="isLoading()"
          (rowUpdated)="onRowUpdated($event)"
        ></platform-settings-group>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer {
  links: LinkItem[] = [
    { id: 'id-and-password', label: 'ID and Password', active: false },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'company', label: 'Company' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'offboarding', label: 'Offboarding' },
  ];

  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();
  private updateUserProfileMutation =
    this.userProfileService.updateUserProfile();

  isLoading = computed(
    () =>
      this.userProfileQuery.isFetching() || this.userProfileQuery.isLoading()
  );

  idAndPasswordRows = computed<[string, string][]>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return [];
    return [
      ['E-mail', profile.email],
      ['Password', '********'],
    ];
  });

  contactInformationRows = computed<[string, string][]>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return [];
    return [
      ['Name', `${profile.firstName} ${profile.lastName}`],
      ['Display name', profile.displayName || 'Inactive'],
      ['Email address', profile.email],
      ['Phone number', 'Inactive'],
      ['Country or region of residence', profile.country],
      [
        'Preferred language for communication',
        profile.preferredLanguage || 'Inactive',
      ],
    ];
  });

  companyRows = computed<[string, string][]>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return [];
    return [
      ['Organization information', profile.company],
      ['Work information', profile.title || 'Inactive'],
    ];
  });

  addressesRows = computed<[string, string][]>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return [];
    return [['Address information', profile.address || 'Inactive']];
  });

  onRowUpdated({ field, value }: { field: string; value: string }): void {
    // Map the displayed field names to API payload keys
    const fieldMapping: Record<string, string> = {
      'E-mail': 'email',
      Password: 'password', // Ensure backend expects 'password'
      Name: 'name',
      'Display name': 'displayName',
      'Email address': 'email',
      'Phone number': 'phoneNumber',
      'Country or region of residence': 'country',
      'Preferred language for communication': 'preferredLanguage',
      'Organization information': 'company',
      'Work information': 'title',
      'Address information': 'address',
    };

    // Map the field to the correct API key
    const payloadKey = fieldMapping[field];

    if (!payloadKey) {
      console.error(`Unknown field: ${field}`);
      return;
    }

    // Update the user profile using the mapped key
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
