// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  standalone: true,
  imports: [ButtonComponent],
  selector: 'app-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <ui-button>Click Me!rfenjfnejkf</ui-button> `,
})
export class HomeComponent {}
