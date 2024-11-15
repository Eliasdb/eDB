import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadingModule } from 'carbon-components-angular'; // Import the LoadingModule from Carbon

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule, LoadingModule], // Ensure LoadingModule is imported
  template: `
    <cds-loading
      *ngIf="isActive"
      [size]="size"
      [overlay]="overlay"
      [isActive]="isActive"
    ></cds-loading>
  `,
  styleUrls: ['./spinner.component.scss'], // You can add custom styles here if necessary
})
export class SpinnerComponent {
  @Input() isActive: boolean = false; // Controls visibility of the spinner
  @Input() size: 'normal' | 'sm' = 'sm'; // Size of the spinner
  @Input() overlay: boolean = false; // Whether to show overlay with the spinner
}
