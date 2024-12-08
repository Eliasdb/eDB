import { Component, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-select',
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

      @for (option of options(); track option) {
        @if (!option.group) {
          <option [value]="option.value">{{ option.label }}</option>
        } @else {
          <optgroup [label]="option.label">
            @for (subOption of option.options; track subOption.value) {
              <option [value]="subOption.value">{{ subOption.label }}</option>
            }
          </optgroup>
        }
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
  readonly options = input<
    Array<
      | { value: string; label: string; group?: false }
      | {
          label: string;
          group: true;
          options: { value: string; label: string }[];
        }
    >
  >([]);
  readonly model = input<string>('');

  // Writable signal for managing local state
  localModel = signal(this.model());

  constructor() {
    // Sync localModel with input model
    effect(() => {
      this.localModel.set(this.model());
    });
  }

  // Getter for modelValue
  get modelValue(): string {
    return this.localModel();
  }

  // Setter for modelValue (called when the value changes in the UI)
  onModelChange(newValue: string): void {
    this.localModel.set(newValue); // Update the local signal
  }
}
