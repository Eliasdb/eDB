import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'carbon-components-angular';

type FlatOption = { value: string; label: string; group?: false };
type GroupedOption = {
  label: string;
  group: true;
  options: { value: string; label: string }[];
};

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [SelectModule, FormsModule],
  template: `
    <cds-select
      [skeleton]="skeleton()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [size]="size()"
      [invalid]="invalid()"
      [invalidText]="invalidText()"
      [warn]="warn()"
      [warnText]="warnText()"
      [label]="label()"
      [helperText]="helperText()"
      [theme]="theme()"
      [value]="modelValue"
      (valueChange)="onModelChange($event)"
      [display]="display()"
    >
      @if (placeholder()) {
        <option value="default" disabled selected hidden>
          {{ placeholder() }}
        </option>
      }

      <!-- Flat Options -->
      @for (option of flatOptions; track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }

      <!-- Grouped Options -->
      @for (group of groupedOptions; track group.label) {
        <optgroup [label]="group.label">
          @for (subOption of group.options; track subOption.value) {
            <option [value]="subOption.value">{{ subOption.label }}</option>
          }
        </optgroup>
      }
    </cds-select>
  `,
})
export class UiSelectComponent {
  readonly label = input<string>('');
  readonly helperText = input<string>('');
  readonly invalidText = input<string>('');
  readonly warnText = input<string>('');
  readonly placeholder = input<string>('Choose an option');
  readonly theme = input<'light' | 'dark'>('light');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly skeleton = input<boolean>(false);
  readonly display = input<'inline' | 'default'>('default');
  readonly options = input<Array<FlatOption | GroupedOption>>([]);
  readonly model = input<string>('');

  localModel = signal(this.model());

  @Output() valueChange = new EventEmitter<string>();

  constructor() {
    effect(() => {
      this.localModel.set(this.model());
    });
  }

  get modelValue(): string {
    return this.localModel();
  }

  onModelChange(newValue: string): void {
    this.localModel.set(newValue);
    this.valueChange.emit(newValue);
  }

  // 🟢 Type-predicated getters to split union arrays
  get flatOptions(): FlatOption[] {
    return this.options().filter((o): o is FlatOption => !o.group);
  }

  get groupedOptions(): GroupedOption[] {
    return this.options().filter((o): o is GroupedOption => o.group === true);
  }
}
