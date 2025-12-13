import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiShellHostComponent } from '@eDB/feature-shell';
import { ModalModule, PlaceholderModule } from 'carbon-components-angular';

@Component({
  selector: 'app-root',
  imports: [UiShellHostComponent, ModalModule, PlaceholderModule],
  template: `
    <ibm-modal-placeholder></ibm-modal-placeholder>
    <edb-shell-host />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}
