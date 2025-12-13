import { Component } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';

@Component({
  selector: 'app-root',
  imports: [UiShellHostComponent],
  template: '<edb-shell-host />',
})
export class AppComponent {}
