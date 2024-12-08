// appointment-app/src/app/appointment-app.component.ts
import { Component } from '@angular/core';
import { UiButtonComponent } from '@eDB/shared-ui'; // Import the standalone component directly

@Component({
  selector: 'app-appointment-home',
  imports: [UiButtonComponent],
  template: `<h1>Appointment Home</h1>
    <ui-button>Click Me!rfenjfnejkf</ui-button>`,
})
export class AppointmentHomeComponent {}
