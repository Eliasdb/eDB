import { Component, input } from '@angular/core';
import { SkeletonModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-skeleton-text',
  imports: [SkeletonModule],
  template: `
    <cds-skeleton-text
      [lines]="lines()"
      [minLineWidth]="minLineWidth()"
      [maxLineWidth]="maxLineWidth()"
    >
    </cds-skeleton-text>
  `,
})
export class UiSkeletonTextComponent {
  readonly lines = input<number>(3); // Default number of skeleton lines
  readonly minLineWidth = input<number>(50); // Minimum width percentage of a line
  readonly maxLineWidth = input<number>(100); // Maximum width percentage of a line
}
