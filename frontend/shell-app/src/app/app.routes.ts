import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'about', component: AppComponent },
  // Lazy load a microfrontend module
  {
    path: 'appointments',
    loadChildren: () =>
      import('appointments/AppointmentsModule').then(
        (m) => m.AppointmentsModule
      ),
  },
];
