import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@e-db/ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';
import { UserProfileService } from '../../../services/user-profile-service/user-profile.service';

interface LinkItem {
  id: string;
  label: string;
  active?: boolean;
}

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
          [rows]="idAndPasswordRows() || skeletonRows"
          [skeleton]="isLoading()"
        ></platform-settings-group>

        <platform-settings-group
          id="contact-information"
          header="Contact Information"
          headerIcon="faContactCard"
          [rows]="contactInformationRows() || skeletonRows"
          [skeleton]="isLoading()"
        ></platform-settings-group>

        <platform-settings-group
          id="company"
          header="Company"
          headerIcon="faBuilding"
          [rows]="companyRows() || skeletonRows"
          [skeleton]="isLoading()"
        ></platform-settings-group>

        <platform-settings-group
          id="addresses"
          header="Addresses"
          headerIcon="faKey"
          [rows]="addressesRows() || skeletonRows"
          [skeleton]="isLoading()"
        ></platform-settings-group>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer implements OnInit {
  links: LinkItem[] = [
    { id: 'id-and-password', label: 'ID and Password', active: false },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'company', label: 'Company' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'offboarding', label: 'Offboarding' },
  ];

  skeletonRows: [string, string][] = [['Loading...', '']];

  private userProfileService = inject(UserProfileService);
  private userProfileQuery = this.userProfileService.fetchUserProfile();

  isLoading = computed(
    () =>
      this.userProfileQuery.isFetching() || this.userProfileQuery.isLoading()
  );

  idAndPasswordRows = computed<[string, string][] | null>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return null;
    return [
      ['E-mail', profile.email],
      ['Password', '********'], // Masked for security
    ];
  });

  contactInformationRows = computed<[string, string][] | null>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return null;
    return [
      ['Name', `${profile.firstName} ${profile.lastName}`],
      ['Display name', profile.displayName || 'Inactive'],
      ['Email address', profile.email],
      ['Phone number', 'Inactive'], // Placeholder for phone number
      ['Country or region of residence', profile.country],
      [
        'Preferred language for communication',
        profile.preferredLanguage || 'Inactive',
      ],
    ];
  });

  companyRows = computed<[string, string][] | null>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return null;
    return [
      ['Organization information', profile.company],
      ['Work information', profile.title || 'Inactive'],
    ];
  });

  addressesRows = computed<[string, string][] | null>(() => {
    const profile = this.userProfileQuery.data();
    if (!profile) return null;
    return [['Address information', profile.address || 'Inactive']];
  });

  ngOnInit(): void {
    effect(() => {
      const profile = this.userProfileQuery.data();
      if (profile) {
        // Perform any side effects or additional logic here
      }
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
