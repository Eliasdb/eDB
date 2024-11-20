import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@e-db/ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';

interface LinkItem {
  id: string;
  label: string;
  active?: boolean;
}

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  company: string;
  displayName: string;
  preferredLanguage: string;
  title: string;
  address: string;
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
          [rows]="idAndPasswordRows"
        ></platform-settings-group>

        <platform-settings-group
          id="contact-information"
          header="Contact Information"
          headerIcon="faContactCard"
          [rows]="contactInformationRows"
        ></platform-settings-group>

        <platform-settings-group
          id="company"
          header="Company"
          headerIcon="faBuilding"
          [rows]="companyRows"
        ></platform-settings-group>

        <platform-settings-group
          id="addresses"
          header="Addresses"
          headerIcon="faKey"
          [rows]="addressesRows"
        ></platform-settings-group>
      </section>
    </section>
  `,
  styleUrls: ['./profile.container.scss'],
})
export class ProfileContainer implements OnInit, AfterViewInit {
  private readonly apiUrl = 'http://localhost:9101/api/profile/settings';
  links: LinkItem[] = [
    { id: 'id-and-password', label: 'ID and Password', active: false },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'company', label: 'Company' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'offboarding', label: 'Offboarding' },
  ];

  idAndPasswordRows: [string, string][] = [];
  contactInformationRows: [string, string][] = [];
  companyRows: [string, string][] = [];
  addressesRows: [string, string][] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  ngAfterViewInit() {
    const activeLink = this.links.find((link) => link.active);
    if (activeLink) {
      this.scrollToSection(activeLink.id);
    }
  }

  fetchUserProfile(): void {
    this.http.get<UserProfile>(this.apiUrl).subscribe({
      next: (profile) => {
        this.populateRows(profile);
      },
      error: (error) => {
        console.error('Failed to fetch user profile:', error);
      },
    });
  }

  populateRows(profile: UserProfile): void {
    this.idAndPasswordRows = [
      ['E-mail', profile.email],
      ['Password', '********'], // Masked for security
    ];

    this.contactInformationRows = [
      ['Name', `${profile.firstName} ${profile.lastName}`],
      ['Display name', profile.displayName || 'Inactive'],
      ['Email address', profile.email],
      ['Phone number', 'Inactive'], // Placeholder for phone number
      ['Country or region of residence', profile.country],
      ['Preferred language for communication', profile.preferredLanguage],
    ];

    this.companyRows = [
      ['Organization information', profile.company],
      ['Work information', profile.title || 'Inactive'],
    ];

    this.addressesRows = [
      ['Address information', profile.address || 'Inactive'],
    ];
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
