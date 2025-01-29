import { Component } from '@angular/core';
import { ShellComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-root',
  template: `<app-shell></app-shell>`,
  imports: [ShellComponent],
  styleUrls: ['app.component.scss'],
})
export class AppComponent {}
