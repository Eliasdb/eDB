// settings.component.ts
import { AfterViewInit, Component } from '@angular/core';
import { UiSidenavComponent, UiTitleComponent } from '@e-db/ui';
import { SettingsGroupComponent } from '../../../components/platform/settings-group/settings-group.component';

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
          [rows]="[
            ['E-mail', 'Active'],
            ['Password', 'Inactive']
          ]"
        ></platform-settings-group>

        <platform-settings-group
          id="contact-information"
          header="Contact Information"
          headerIcon="faContactCard"
          [rows]="[
            ['Name', 'Active'],
            ['Display name', 'Inactive'],
            ['Email address', 'Inactive'],
            ['Phone number', 'Inactive'],
            ['Country or region of residence', 'Inactive'],
            ['Preferred language for communication', 'Inactive']
          ]"
        ></platform-settings-group>

        <platform-settings-group
          id="company"
          header="Company"
          headerIcon="faBuilding"
          [rows]="[
            ['Organization information', 'Active'],
            ['Work information', 'Inactive']
          ]"
        ></platform-settings-group>

        <platform-settings-group
          id="addresses"
          header="Addresses"
          headerIcon="faKey"
          [rows]="[['Address information', 'Active']]"
        ></platform-settings-group>

        <platform-settings-group
          id="offboarding"
          header="Offboarding"
          [rows]="[['Account offboarding', 'Delete your account and data']]"
        ></platform-settings-group>
      </section>
    </section>
  `,
  styleUrls: ['./settings.container.scss'],
})
export class SettingsContainer implements AfterViewInit {
  links: LinkItem[] = [
    { id: 'id-and-password', label: 'ID and Password', active: false },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'company', label: 'Company' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'offboarding', label: 'Offboarding' },
  ];

  ngAfterViewInit() {
    // Scroll to the active section on load
    const activeLink = this.links.find((link) => link.active);
    if (activeLink) {
      this.scrollToSection(activeLink.id);
    }
  }

  onLinkClick(clickedItem: LinkItem): void {
    // Update active state
    this.links.forEach((link) => {
      link.active = link.id === clickedItem.id;
    });

    // Scroll to the section
    this.scrollToSection(clickedItem.id);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
