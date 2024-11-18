import { Component } from '@angular/core';
import { UiStructuredListComponent } from '@e-db/ui';

@Component({
  selector: 'platform-settings',
  standalone: true,
  imports: [UiStructuredListComponent],
  template: `
    <section class="settings-page">
      <h1>Welcome to settings</h1>
      <section class="settings">
        <ui-structured-list
          [header]="'ID and Password'"
          [headerIcon]="'faKey'"
          [rows]="[
            ['E-mail', 'Active'],
            ['Password', 'Inactive']
          ]"
        ></ui-structured-list>
      </section>
    </section>
  `,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {}
