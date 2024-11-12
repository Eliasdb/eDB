// appointment-app/src/app/appointments.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentHomeComponent } from './appointment-app.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentHomeComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AppointmentHomeComponent, // Import standalone component directly here
  ],
})
export class AppointmentsModule {}
