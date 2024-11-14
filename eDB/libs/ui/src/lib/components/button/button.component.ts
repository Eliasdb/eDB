import { Component } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [ButtonModule],
  template: '<button cdsButton="primary"><ng-content></ng-content></button>',
  // styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {}
