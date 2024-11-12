import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppointmentHomeComponent } from './app/appointment-app.component';

bootstrapApplication(AppointmentHomeComponent, appConfig).catch((err) =>
  console.error(err)
);
