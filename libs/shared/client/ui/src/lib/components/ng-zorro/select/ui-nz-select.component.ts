import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

export type UiNzSelectMode = 'default' | 'multiple' | 'tags';
export type UiNzSelectSize = 'large' | 'default' | 'small';

export interface UiNzSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface UiNzSelectGroup {
  label: string;
  options: UiNzSelectOption[];
}

export type UiNzSelectValue = string | number | Array<string | number> | null;

@Component({
  selector: 'ui-nz-select',
  standalone: true,
  imports: [NzSelectModule, FormsModule],
  host: { class: 'block' },
  template: `
    <nz-select
      class="w-full"
      [ngModel]="value()"
      (ngModelChange)="onValueChange($event)"
      [nzMode]="mode()"
      [nzPlaceHolder]="placeholder()"
      [nzDisabled]="disabled()"
      [nzAllowClear]="allowClear()"
      [nzShowSearch]="showSearch()"
      [nzSize]="size()"
      [nzMaxTagCount]="maxTagCount()!"
    >
      @for (option of flatOptions(); track option.value) {
        <nz-option
          [nzValue]="option.value"
          [nzLabel]="option.label"
          [nzDisabled]="option.disabled ?? false"
        ></nz-option>
      }

      @for (group of groupedOptions(); track group.label) {
        <nz-option-group [nzLabel]="group.label">
          @for (option of group.options; track option.value) {
            <nz-option
              [nzValue]="option.value"
              [nzLabel]="option.label"
              [nzDisabled]="option.disabled ?? false"
            ></nz-option>
          }
        </nz-option-group>
      }
    </nz-select>
  `,
})
export class UiNzSelectComponent {
  readonly value = input<UiNzSelectValue>(null);
  readonly options = input<Array<UiNzSelectOption | UiNzSelectGroup>>([]);
  readonly placeholder = input<string>('Select an option');
  readonly disabled = input<boolean>(false);
  readonly allowClear = input<boolean>(true);
  readonly showSearch = input<boolean>(false);
  readonly size = input<UiNzSelectSize>('default');
  readonly mode = input<UiNzSelectMode>('default');
  readonly maxTagCount = input<number | undefined>(undefined); // default undefined

  @Output() readonly valueChange = new EventEmitter<UiNzSelectValue>();

  readonly flatOptions = computed(
    () => this.options().filter(isSimpleOption) as UiNzSelectOption[],
  );

  readonly groupedOptions = computed(
    () => this.options().filter(isGroupOption) as UiNzSelectGroup[],
  );

  onValueChange(value: UiNzSelectValue): void {
    this.valueChange.emit(value);
  }
}

function isGroupOption(
  option: UiNzSelectOption | UiNzSelectGroup,
): option is UiNzSelectGroup {
  return 'options' in option;
}

function isSimpleOption(
  option: UiNzSelectOption | UiNzSelectGroup,
): option is UiNzSelectOption {
  return !('options' in option);
}
