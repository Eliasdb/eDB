// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { UiButtonComponent } from '@e-db/ui';

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  selector: 'platform-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <p>yooo yoo</p>
    <ui-button icon="faPlus">Click Me!rfenjfewwewrnejkf</ui-button>
    <ui-button [loading]="true">Loading Button</ui-button> `,
})
export class HomeComponent {}
