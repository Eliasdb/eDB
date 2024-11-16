import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component'; // Import the SpinnerComponent

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, IconComponent, SpinnerComponent], // Include the SpinnerComponent here
  template: `
    <button
      [type]="type"
      [ngClass]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
    >
      <!-- Show spinner when loading -->
      <ng-container *ngIf="loading">
        <ui-spinner
          [isActive]="loading"
          [size]="'sm'"
          [overlay]="false"
        ></ui-spinner>
        <!-- Use the Spinner Component here -->
      </ng-container>

      <ng-container *ngIf="icon && iconPosition === 'left'">
        <app-icon
          [name]="icon"
          [fixedWidth]="fixedWidth"
          [color]="color"
        ></app-icon>
      </ng-container>

      <span class="button-text">
        <ng-content></ng-content>
      </span>

      <ng-container *ngIf="icon && iconPosition === 'right'">
        <app-icon
          [name]="icon"
          [fixedWidth]="fixedWidth"
          [color]="color"
        ></app-icon>
      </ng-container>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false; // Control loading state
  @Input() icon?: string; // The full FontAwesome icon name, e.g. 'faPlus'
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fixedWidth: boolean = false;
  @Input() color: string = '';

  @Output() buttonClick = new EventEmitter<Event>();

  get buttonClasses() {
    return {
      'ui-button': true,
      [this.variant]: true,
      [this.size]: true,
      'is-loading': this.loading,
      'is-disabled': this.disabled,
    };
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
