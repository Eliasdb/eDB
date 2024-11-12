import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `<button ibmButton="primary">
    <ng-content></ng-content>
  </button>`,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {}
