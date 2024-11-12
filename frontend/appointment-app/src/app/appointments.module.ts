// In mf-appointment-app/src/app/appointments.module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  imports: [CommonModule, AppComponent],
  exports: [AppComponent],
})
export class AppointmentsModule {}
