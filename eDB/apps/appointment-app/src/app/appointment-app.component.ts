// appointment-app/src/app/appointment-app.component.ts
import { Component } from '@angular/core';
import { ButtonComponent } from '@e-db/ui'; // Import the standalone component directly

@Component({
  selector: 'app-appointment-home',
  imports: [ButtonComponent],
  standalone: true,
  template: `<h1>Appointment Home</h1>
    <lib-button>Click Me!rfenjfnejkf</lib-button>`,
})
export class AppointmentHomeComponent {}
