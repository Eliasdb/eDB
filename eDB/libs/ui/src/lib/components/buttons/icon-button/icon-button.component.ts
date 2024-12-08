import { Component, EventEmitter, Output, input } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [UiIconComponent, ButtonModule],
  template: `
    <cds-icon-button
      [id]="buttonId()"
      [size]="size()"
      [class]="buttonNgClass()"
      [attr.disabled]="disabled() ? true : null"
      [class.tooltip-disabled]="showTooltipWhenDisabled() && disabled()"
      [description]="description()"
      (click)="onClick($event)"
      (mouseenter)="onMouseEnter($event)"
      (mouseleave)="onMouseLeave($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
    >
      <ui-icon
        class="cds--btn__icon"
        [name]="icon()"
        [size]="iconSize()"
        [color]="iconColor()"
        [fixedWidth]="false"
      ></ui-icon>
    </cds-icon-button>
  `,
})
export class UiIconButtonComponent {
  readonly buttonId = input<string>('icon-button');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly kind = input<string>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('sm');
  readonly align = input<'left' | 'right' | 'center'>('center');
  readonly buttonNgClass = input<string>('');
  readonly buttonAttributes = input<{
    [key: string]: any;
  }>({});
  readonly disabled = input<boolean>(false);
  readonly showTooltipWhenDisabled = input<boolean>(false);
  readonly description = input<string>('Icon button');
  readonly icon = input.required<string>();
  readonly iconSize = input<string>('16px');
  readonly iconColor = input<string>('');

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
