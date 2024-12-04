import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, PlaceholderModule } from 'carbon-components-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, PlaceholderModule, I18nModule],
  template: `
    <router-outlet></router-outlet>
    <cds-placeholder></cds-placeholder>
  `,
})
export class AppComponent {
  title = 'eDB';
}
