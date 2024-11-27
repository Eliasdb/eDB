import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule, UiIconComponent, ButtonModule],
  template: `
    <cds-icon-button
      [id]="buttonId"
      [size]="size"
      [class]="buttonNgClass"
      [attr.disabled]="disabled ? true : null"
      [ngClass]="{ 'tooltip-disabled': showTooltipWhenDisabled && disabled }"
      [description]="description"
      (click)="onClick($event)"
      (mouseenter)="onMouseEnter($event)"
      (mouseleave)="onMouseLeave($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    >
      <ui-icon
        class="cds--btn__icon"
        [name]="icon"
        [size]="iconSize"
        [color]="iconColor"
        [fixedWidth]="false"
      ></ui-icon>
    </cds-icon-button>
  `,
})
export class UiIconButtonComponent {
  @Input() buttonId: string = 'icon-button';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() kind: string = 'primary'; // Style for the button (e.g., primary, secondary)
  @Input() size: 'sm' | 'md' | 'lg' = 'sm'; // Size of the button
  @Input() align: 'left' | 'right' | 'center' = 'center'; // Alignment for the button content
  @Input() buttonNgClass: string = ''; // Additional CSS classes for the button
  @Input() buttonAttributes: { [key: string]: any } = {}; // Additional attributes for the button
  @Input() disabled: boolean = false;
  @Input() showTooltipWhenDisabled: boolean = false; // Tooltip visibility when disabled
  @Input() description: string = 'Icon button'; // Tooltip or ARIA label
  @Input() icon!: string; // Name of the icon for UiIconComponent
  @Input() iconSize: string = '16px'; // Size of the icon
  @Input() iconColor: string = ''; // Optional color for the icon

  @Output() click = new EventEmitter<Event>();
  @Output() mouseEnter = new EventEmitter<Event>();
  @Output() mouseLeave = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();

  onClick(event: Event) {
    this.click.emit(event);
  }

  onMouseEnter(event: Event) {
    this.mouseEnter.emit(event);
  }

  onMouseLeave(event: Event) {
    this.mouseLeave.emit(event);
  }

  onFocus(event: Event) {
    this.focus.emit(event);
  }

  onBlur(event: Event) {
    this.blur.emit(event);
  }
}
