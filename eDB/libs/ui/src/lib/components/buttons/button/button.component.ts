import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';
import { UiLoadingSpinnerComponent } from '../../loading/loading-spinner.component';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    UiLoadingSpinnerComponent,
    UiIconComponent,
  ],
  template: `
    <button
      [ngClass]="{ 'full-width': fullWidth }"
      [cdsButton]="variant"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
      [size]="size"
      [isExpressive]="isExpressive"
      [type]="type"
    >
      <span class="button-text">
        <ng-content></ng-content>
      </span>

      @if (icon && !loading) {
        <ui-icon class="cds--btn__icon" [name]="icon"></ui-icon>
      } @else if (loading) {
        <ui-loading class="cds--btn__icon" [isActive]="true"></ui-loading>
      }
    </button>
  `,
  styleUrls: ['./button.component.scss'], // Corrected styleUrl to styleUrls
})
export class UiButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost' =
    'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() isExpressive: boolean = false;
  @Input() fullWidth: boolean = false;

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
