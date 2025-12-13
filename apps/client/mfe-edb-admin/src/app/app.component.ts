import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-admin-root',
  template: `<edb-shell-host></edb-shell-host>`,
  imports: [UiShellHostComponent],
})
export class AppComponent {}
