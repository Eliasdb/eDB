import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-webshop-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {}
