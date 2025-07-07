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
      (click)="handleClick($event)"
      (mouseenter)="handleMouseEnter($event)"
      (mouseleave)="handleMouseLeave($event)"
      (focus)="handleFocus($event)"
      (blur)="handleBlur($event)"
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

  // Rename these to avoid native DOM event conflicts
  @Output() iconButtonClick = new EventEmitter<Event>();
  @Output() iconButtonMouseEnter = new EventEmitter<Event>();
  @Output() iconButtonMouseLeave = new EventEmitter<Event>();
  @Output() iconButtonFocus = new EventEmitter<Event>();
  @Output() iconButtonBlur = new EventEmitter<Event>();
  @Output() click = new EventEmitter<Event>(); // 👈 this line

  handleClick(event: Event): void {
    this.iconButtonClick.emit(event); // existing
    this.click.emit(event); // 👈 add this
  }

  handleMouseEnter(event: Event): void {
    this.iconButtonMouseEnter.emit(event);
  }

  handleMouseLeave(event: Event): void {
    this.iconButtonMouseLeave.emit(event);
  }

  handleFocus(event: Event): void {
    this.iconButtonFocus.emit(event);
  }

  handleBlur(event: Event): void {
    this.iconButtonBlur.emit(event);
  }
}
