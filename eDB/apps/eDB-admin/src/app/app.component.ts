import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/shared-ui'; // ← or wherever you put your host component

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [UiShellHostComponent],
  template: `<ui-shell-host />`, // cleaner
})
export class AppComponent {}
