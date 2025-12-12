import { Component, EventEmitter, Output, input } from '@angular/core';
import { NzButtonModule, NzButtonShape } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type UiNzButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';

export type UiNzButtonShape = 'default' | 'circle' | 'round';
export type UiNzButtonSize = 'large' | 'default' | 'small';
export type UiNzIconTheme = 'outline' | 'fill' | 'twotone';

@Component({
  selector: 'ui-nz-button',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  host: { class: 'inline-flex' },
  template: `
    <button
      nz-button
      class="inline-flex items-center gap-2 font-medium"
      [nzType]="type()"
      [nzDanger]="danger()"
      [nzLoading]="loading()"
      [disabled]="disabled()"
      [nzShape]="shape()"
      [nzSize]="size()"
      (click)="handleClick($event)"
    >
      @if (icon(); as iconName) {
        <span
          nz-icon
          class="inline-flex items-center text-base"
          [nzType]="iconName"
          [nzTheme]="iconTheme()"
        ></span>
      }
      <span class="inline-flex items-center">
        <ng-content></ng-content>
      </span>
    </button>
  `,
})
export class UiNzButtonComponent {
  readonly type = input<UiNzButtonType>('primary');
  readonly size = input<UiNzButtonSize>('default');
  readonly shape = input<NzButtonShape | null>(null);
  readonly danger = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly icon = input<string | null>(null);
  readonly iconTheme = input<UiNzIconTheme>('outline');

  @Output() readonly buttonClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
    }
  }
}
