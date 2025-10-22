import {
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

export type UiNzSwitchSize = 'default' | 'small';

@Component({
  selector: 'ui-nz-switch',
  standalone: true,
  imports: [NzSwitchModule, FormsModule],
  host: { class: 'inline-flex' },
  template: `
    <label class="inline-flex items-center gap-2 text-sm text-slate-700">
      <nz-switch
        [ngModel]="checked()"
        (ngModelChange)="onCheckedChange($event)"
        [nzDisabled]="disabled()"
        [nzLoading]="loading()"
        [nzSize]="size()"
        [nzCheckedChildren]="checkedLabel()"
        [nzUnCheckedChildren]="uncheckedLabel()"
      ></nz-switch>
      @if (label(); as switchLabel) {
        <span>{{ switchLabel }}</span>
      }
    </label>
  `,
})
export class UiNzSwitchComponent {
  readonly label = input<string | null>(null);
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly size = input<UiNzSwitchSize>('default');
  readonly checkedLabel = input<string | null>(null);
  readonly uncheckedLabel = input<string | null>(null);

  @Output() readonly checkedChange = new EventEmitter<boolean>();

  onCheckedChange(value: boolean): void {
    this.checkedChange.emit(value);
  }
}
