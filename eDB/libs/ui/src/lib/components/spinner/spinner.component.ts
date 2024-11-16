import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule, LoadingModule],
  template: `
    <cds-loading
      *ngIf="isActive"
      [size]="size"
      [overlay]="overlay"
      [isActive]="isActive"
    ></cds-loading>
  `,
})
export class SpinnerComponent {
  @Input() isActive: boolean = true;
  @Input() size: 'normal' | 'sm' = 'sm';
  @Input() overlay: boolean = false;
}
