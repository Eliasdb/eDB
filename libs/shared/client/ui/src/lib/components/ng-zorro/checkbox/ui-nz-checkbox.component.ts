import {
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'ui-nz-checkbox',
  standalone: true,
  imports: [NzCheckboxModule, FormsModule],
  host: { class: 'inline-flex' },
  template: `
    <label
      nz-checkbox
      [ngModel]="checked()"
      (ngModelChange)="onCheckedChange($event)"
      [nzDisabled]="disabled()"
      [nzIndeterminate]="indeterminate()"
      [nzAutoFocus]="autoFocus()"
    >
      {{ label() }}
    </label>
  `,
})
export class UiNzCheckboxComponent {
  readonly label = input<string>('Checkbox');
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly autoFocus = input<boolean>(false);

  @Output() readonly checkedChange = new EventEmitter<boolean>();

  onCheckedChange(value: boolean): void {
    this.checkedChange.emit(value);
  }
}
