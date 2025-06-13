import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/shared-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiShellHostComponent],
  template: `<ui-shell-host />`,
})
export class AppComponent {}
