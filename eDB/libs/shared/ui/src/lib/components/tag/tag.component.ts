import { Component, input } from '@angular/core';
import { TagModule } from 'carbon-components-angular';
import { UiIconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-tag',
  imports: [TagModule, UiIconComponent],
  template: `
    <cds-tag [type]="type()" [size]="size()" class="ui-tag">
      @if (icon()) {
        <div cdsTagIcon>
          <ui-icon></ui-icon>
        </div>
      }
      {{ label() }}
    </cds-tag>
  `,
  styleUrls: ['./tag.component.scss'],
})
export class UiTagComponent {
  readonly type = input<
    | 'red'
    | 'magenta'
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'gray'
    | 'cool-gray'
    | 'warm-gray'
    | 'high-contrast'
    | 'outline'
  >('red'); // Default to 'red'
  readonly size = input<'sm' | 'md'>('md'); // Restrict to 'sm' or 'md'
  readonly label = input.required<string>(); // Label for the tag
  readonly icon = input<string>(); // Icon name for the UiIconComponent
}
