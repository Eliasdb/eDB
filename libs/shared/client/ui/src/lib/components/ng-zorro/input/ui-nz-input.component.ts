import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

export type UiNzInputType = 'text' | 'password' | 'email' | 'number';
export type UiNzInputSize = 'large' | 'default' | 'small';

@Component({
  selector: 'ui-nz-input',
  standalone: true,
  imports: [NzInputModule, FormsModule],
  host: { class: 'block' },
  template: `
    <label class="flex flex-col gap-1 text-sm text-slate-700">
      @if (label(); as labelText) {
        <span class="font-medium text-slate-900">{{ labelText }}</span>
      }

      <input
        nz-input
        class="rounded-md border border-slate-200 px-3 py-2 focus:border-slate-400 focus:shadow-sm focus:shadow-slate-200"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [ngModel]="value()"
        (ngModelChange)="onValueChange($event)"
        [nzSize]="size()"
      />

      @if (description(); as helpText) {
        <small class="text-xs text-slate-500">{{ helpText }}</small>
      }
    </label>
  `,
})
export class UiNzInputComponent {
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly label = input<string>('');
  readonly description = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly size = input<UiNzInputSize>('default');
  readonly type = input<UiNzInputType>('text');

  @Output() readonly valueChange = new EventEmitter<string>();

  onValueChange(value: string): void {
    this.valueChange.emit(value);
  }
}
