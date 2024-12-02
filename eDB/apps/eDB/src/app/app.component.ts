import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ExperimentalService,
  I18nModule,
  ModalService,
  PlaceholderModule,
  PlaceholderService,
} from 'carbon-components-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, PlaceholderModule, I18nModule],
  providers: [ModalService, ExperimentalService, PlaceholderService],
  template: `
    <router-outlet></router-outlet>
    <cds-placeholder></cds-placeholder>
  `,
})
export class AppComponent {
  title = 'eDB';
}
