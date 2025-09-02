// ui-icon-button.component.ts
import { Component, EventEmitter, Output, input } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { UiIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'ui-icon-button',
  imports: [UiIconComponent, ButtonModule],
  template: `
    <cds-icon-button
      [id]="buttonId()"
      [size]="size()"
      [class]="buttonNgClass()"
      [attr.disabled]="disabled() ? true : null"
      [class.tooltip-disabled]="showTooltipWhenDisabled() && disabled()"
      [description]="description()"
      (click)="handleClick($event)"
      (mouseenter)="handleMouseEnter($event)"
      (mouseleave)="handleMouseLeave($event)"
      (focus)="handleFocus($event)"
      (blur)="handleBlur($event)"
      [attr.aria-label]="ariaLabel()"
      [attr.data-testid]="testId()"
      role="button"
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
  readonly buttonAttributes = input<Record<string, unknown>>({});
  readonly disabled = input<boolean>(false);
  readonly showTooltipWhenDisabled = input<boolean>(false);
  readonly description = input<string>('Icon button');
  readonly icon = input.required<string>();
  readonly iconSize = input<string>('16px');
  readonly iconColor = input<string>('');

  // NEW: attributes we want to forward to the real button
  readonly ariaLabel = input<string | null>(null);
  readonly testId = input<string | null>(null);

  @Output() click = new EventEmitter<Event>();
  @Output() iconButtonClick = new EventEmitter<Event>();
  @Output() iconButtonMouseEnter = new EventEmitter<Event>();
  @Output() iconButtonMouseLeave = new EventEmitter<Event>();
  @Output() iconButtonFocus = new EventEmitter<Event>();
  @Output() iconButtonBlur = new EventEmitter<Event>();

  handleClick(event: Event) {
    this.iconButtonClick.emit(event);
    this.click.emit(event);
  }
  handleMouseEnter(e: Event) {
    this.iconButtonMouseEnter.emit(e);
  }
  handleMouseLeave(e: Event) {
    this.iconButtonMouseLeave.emit(e);
  }
  handleFocus(e: Event) {
    this.iconButtonFocus.emit(e);
  }
  handleBlur(e: Event) {
    this.iconButtonBlur.emit(e);
  }
}
