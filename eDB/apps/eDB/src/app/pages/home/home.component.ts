// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { UiButtonComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  standalone: true,
  imports: [UiButtonComponent],
  selector: 'app-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <ui-button icon="faPlus">Click Me!rfenjfewwewrnejkf</ui-button>
    <ui-button [loading]="true">Loading Button</ui-button> `,
})
export class HomeComponent {}
