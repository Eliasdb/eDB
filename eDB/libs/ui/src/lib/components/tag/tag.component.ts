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
      <ng-container *ngIf="icon">
        <div cdsTagIcon>
          <ui-icon
            [name]="icon"
            [size]="'16px'"
            [color]="'inherit'"
            [fixedWidth]="false"
          ></ui-icon>
        </div>
      </ng-container>
      {{ label }}
    </cds-tag>
  `,
  styleUrls: ['./tag.component.scss'],
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
    | 'outline' = 'red'; // Default to 'red'
  @Input() size: 'sm' | 'md' = 'md'; // Restrict to 'sm' or 'md'
  @Input() label!: string; // Label for the tag
  @Input() icon?: string; // Icon name for the UiIconComponent
}
