import {
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

export type UiNzDatePickerSize = 'large' | 'default' | 'small';

@Component({
  selector: 'ui-nz-date-picker',
  standalone: true,
  imports: [NzDatePickerModule, FormsModule],
  host: { class: 'inline-block' },
  template: `
    <nz-date-picker
      class="w-full"
      [ngModel]="value()"
      (ngModelChange)="onValueChange($event)"
      [nzFormat]="format()"
      [nzDisabled]="disabled()"
      [nzSize]="size()"
      [nzPlaceHolder]="placeholder()"
      [nzAllowClear]="allowClear()"
      [nzShowTime]="showTime()"
    ></nz-date-picker>
  `,
})
export class UiNzDatePickerComponent {
  readonly value = input<Date | null>(null);
  readonly format = input<string>('yyyy-MM-dd');
  readonly placeholder = input<string>('Select date');
  readonly disabled = input<boolean>(false);
  readonly allowClear = input<boolean>(true);
  readonly showTime = input<boolean>(false);
  readonly size = input<UiNzDatePickerSize>('default');

  @Output() readonly valueChange = new EventEmitter<Date | null>();

  onValueChange(value: Date | null): void {
    this.valueChange.emit(value);
  }
}
