import { Component, Input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-loading',
  standalone: true,
  imports: [LoadingModule],
  template: `
    @if (isActive) {
      <cds-loading
        [size]="size"
        [overlay]="overlay"
        [isActive]="isActive"
      ></cds-loading>
    }
  `,
})
export class UiLoadingSpinnerComponent {
  @Input() isActive: boolean = true;
  @Input() size: 'normal' | 'sm' = 'sm';
  @Input() overlay: boolean = false;
}
