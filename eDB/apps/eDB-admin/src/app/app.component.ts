import { Component } from '@angular/core';
import { UiShellHostComponent } from '@edb/shared-ui';

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [UiShellHostComponent],
  template: `<ui-shell-host />`, // cleaner
})
export class AppComponent {}
