import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TagModule } from 'carbon-components-angular';
import { UiIconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  selector: 'ui-tag',
  imports: [TagModule, CommonModule, UiIconComponent],
  template: `
    <cds-tag [type]="type" [size]="size" class="ui-tag">
      <div cdsTagIcon *ngIf="icon">
        <ui-icon [name]="icon" [size]="'16px'" [color]="'inherit'"></ui-icon>
      </div>
      {{ label }}
    </cds-tag>
  `,
  styleUrl: 'tag.component.scss',
})
export class UiTagComponent {
  @Input() type:
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
    | 'outline' = 'red'; // Define valid types
  @Input() size: 'sm' | 'md' = 'md'; // Restrict size to 'sm' or 'md'
  @Input() label!: string;
  @Input() icon?: string; // Optional icon name for UiIconComponent
}
