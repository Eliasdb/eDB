import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [UiIconComponent, ButtonModule],
  template: `
    <cds-icon-button
      [id]="buttonId"
      [size]="size"
      [class]="buttonNgClass"
      [attr.disabled]="disabled ? true : null"
      [class.tooltip-disabled]="showTooltipWhenDisabled && disabled"
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
  @Input() kind: string = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() align: 'left' | 'right' | 'center' = 'center';
  @Input() buttonNgClass: string = '';
  @Input() buttonAttributes: { [key: string]: any } = {};
  @Input() disabled: boolean = false;
  @Input() showTooltipWhenDisabled: boolean = false;
  @Input() description: string = 'Icon button';
  @Input() icon!: string;
  @Input() iconSize: string = '16px';
  @Input() iconColor: string = '';

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
