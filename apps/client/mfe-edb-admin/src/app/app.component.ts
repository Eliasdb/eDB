import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // Dev-only host shell... In prod the remote is loaded via module federation routes.
  selector: 'app-admin-root',
  template: `<router-outlet />`,
  imports: [RouterOutlet],
})
export class AppComponent {}
