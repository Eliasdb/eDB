import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-title',
  standalone: true,
  imports: [CommonModule, LoadingModule],
  template: ` <h2 [class]="className">{{ text }}</h2> `,
  styleUrls: ['title.component.scss'],
})
export class UiTitleComponent {
  @Input() text: string = '';
  @Input() className: string = ''; // Add an input property for the CSS class
}
