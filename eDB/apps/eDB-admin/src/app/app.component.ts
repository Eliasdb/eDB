import { Component } from '@angular/core';
import { ShellComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-admin-root',
  template: `<app-shell></app-shell>`,
  imports: [ShellComponent],
})
export class AppComponent {}
