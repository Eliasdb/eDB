import { Component, input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-title',
  imports: [LoadingModule],
  template: ` <h2 [class]="className()">{{ text() }}</h2> `,
  styleUrls: ['title.component.scss'],
})
export class UiTitleComponent {
  readonly text = input<string>('');
  readonly className = input<string>(''); // Add an input property for the CSS class
}
