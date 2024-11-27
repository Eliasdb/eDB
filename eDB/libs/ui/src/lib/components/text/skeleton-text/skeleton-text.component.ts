import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-skeleton-text',
  standalone: true,
  imports: [SkeletonModule],
  template: `
    <cds-skeleton-text
      [lines]="lines"
      [minLineWidth]="minLineWidth"
      [maxLineWidth]="maxLineWidth"
    >
    </cds-skeleton-text>
  `,
})
export class UiSkeletonTextComponent {
  @Input() lines: number = 3; // Default number of skeleton lines
  @Input() minLineWidth: number = 50; // Minimum width percentage of a line
  @Input() maxLineWidth: number = 100; // Maximum width percentage of a line
}
