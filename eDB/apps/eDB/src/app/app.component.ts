import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-root',
  imports: [UiShellHostComponent],
  template: `<ui-shell-host />`,
})
export class AppComponent {}
