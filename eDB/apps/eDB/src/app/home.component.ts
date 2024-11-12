// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  standalone: true,
  imports: [ButtonComponent],
  selector: 'app-home',
  template: `<h1>Welcome to eDB Platform</h1>
    <lib-button>Click Me!rfenjfnejkf</lib-button> `,
})
export class HomeComponent {}