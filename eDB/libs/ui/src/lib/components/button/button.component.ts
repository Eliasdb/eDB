import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { IconComponent } from '../icon/icon.component';
import { LoadingSpinnerComponent } from '../loading/loading-spinner.component';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, LoadingSpinnerComponent, IconComponent],
  template: `
    <button
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

      <ng-container *ngIf="icon">
        <app-icon class="cds--btn__icon" [name]="icon"></app-icon>
      </ng-container>

      <ng-container *ngIf="loading">
        <ui-loading class="cds--btn__icon" [isActive]="true"></ui-loading>
      </ng-container>
    </button>
  `,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() isExpressive: boolean = false;

  @Output() buttonClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
