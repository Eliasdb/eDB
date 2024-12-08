import { Component, input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-loading',
  imports: [LoadingModule],
  template: `
    @if (isActive()) {
      <cds-loading
        [size]="size()"
        [overlay]="overlay()"
        [isActive]="isActive()"
      ></cds-loading>
    }
  `,
})
export class UiLoadingSpinnerComponent {
  readonly isActive = input<boolean>(true);
  readonly size = input<'normal' | 'sm'>('sm');
  readonly overlay = input<boolean>(false);
}
