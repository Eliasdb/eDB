import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-admin-root',
  template: `<ui-shell-host></ui-shell-host>`,
  imports: [UiShellHostComponent],
})
export class AppComponent {}
