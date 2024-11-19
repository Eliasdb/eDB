import { Component } from '@angular/core';
import { UiSidenavComponent, UiStructuredListComponent } from '@e-db/ui';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [UiStructuredListComponent, UiSidenavComponent],
  template: `
    <section class="settings-page">
      <section class="sidenav">
        <ui-sidenav
          [links]="[
            { id: 'id-and-password', label: 'ID and Password', active: true },
            { id: 'contact-information', label: 'Contact Information' },
            { id: 'company', label: 'Company' },
            { id: 'addresses', label: 'Addresses' },
            { id: 'offboarding', label: 'Offboarding' }
          ]"
        ></ui-sidenav>
      </section>
      <section class="settings-container">
        <div class="setting-group" id="id-and-password">
          <ui-structured-list
            [header]="'ID and Password'"
            [headerIcon]="'faKey'"
            [rows]="[
              ['E-mail', 'Active'],
              ['Password', 'Inactive']
            ]"
          ></ui-structured-list>
        </div>

        <div class="setting-group" id="contact-information">
          <ui-structured-list
            [header]="'Contact Information'"
            [headerIcon]="'faContactCard'"
            [rows]="[
              ['Name', 'Active'],
              ['Display name', 'Inactive'],
              ['Email address', 'Inactive'],
              ['Phone number', 'Inactive'],
              ['Country or region of residence', 'Inactive'],
              ['Preferred language for communication', 'Inactive']
            ]"
          ></ui-structured-list>
        </div>

        <div class="setting-group" id="company">
          <ui-structured-list
            [header]="'Company'"
            [headerIcon]="'faBuilding'"
            [rows]="[
              ['Organization information', 'Active'],
              ['Work information', 'Inactive']
            ]"
          ></ui-structured-list>
        </div>

        <div class="setting-group" id="addresses">
          <ui-structured-list
            [header]="'Addresses'"
            [headerIcon]="'faKey'"
            [rows]="[['Address information', 'Active']]"
          ></ui-structured-list>
        </div>

        <div class="setting-group" id="another-section3">
          <ui-structured-list
            [header]="'Offboarding'"
            [rows]="[['Account offboarding', 'Delete your account and data']]"
          ></ui-structured-list>
        </div>
      </section>
    </section>
  `,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {}
