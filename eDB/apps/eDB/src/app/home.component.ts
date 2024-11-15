// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { ButtonComponent, SpinnerComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  standalone: true,
  imports: [ButtonComponent, SpinnerComponent],
  selector: 'app-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <ui-button icon="faPlus">Click Me!rfenjfewwewrnejkf</ui-button>
    <ui-spinner [isActive]="true" size="sm"></ui-spinner> `,
})
export class HomeComponent {}
