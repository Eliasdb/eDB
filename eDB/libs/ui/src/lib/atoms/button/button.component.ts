import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [ngClass]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
    >
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <!-- <app-dynamic-icon name="faCoffee"></app-dynamic-icon> -->
      </ng-container>
      <span class="button-text">
        <ng-content></ng-content>
      </span>
      <ng-container *ngIf="icon && iconPosition === 'right'">
        <!-- <app-dynamic-icon name="faCheck"></app-dynamic-icon> -->
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
  @Input() loading: boolean = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

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
