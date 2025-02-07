import { Component } from '@angular/core';
import { ShellComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  template: ` <app-shell></app-shell> `,
})
export class AppComponent {}
