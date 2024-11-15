// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { ButtonComponent, DynamicIconComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  standalone: true,
  imports: [ButtonComponent, DynamicIconComponent],
  selector: 'app-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <ui-button icon="add">Click Me!rfenjfnejkf</ui-button>
    <app-dynamic-icon
      name="faSpinner"
      [customSpin]="true"
    ></app-dynamic-icon> `,
})
export class HomeComponent {}
