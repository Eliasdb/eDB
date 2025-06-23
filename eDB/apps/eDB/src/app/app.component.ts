import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiShellHostComponent],
  template: `<ui-shell-host />`,
})
export class AppComponent {}
