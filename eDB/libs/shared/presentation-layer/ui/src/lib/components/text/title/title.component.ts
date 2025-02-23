import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-title',
  imports: [],
  template: `
    <h2 [class]="className()">
      {{ text() }}
    </h2>
  `,
  styleUrls: ['title.component.scss'],
})
export class UiTitleComponent {
  readonly text = input<string>('');
  readonly className = input<string>('');
}
