import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

export const TEXTAREA_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiTextAreaComponent),
  multi: true,
};

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, InputModule],
  template: `
    <cds-textarea-label
      [helperText]="helperText"
      [invalid]="invalid"
      [invalidText]="invalidText"
      [warn]="warn"
      [disabled]="disabled"
      [skeleton]="skeleton"
      [warnText]="warnText"
    >
      {{ label }}
      <textarea
        cdsTextArea
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [theme]="theme"
        [rows]="rows"
        [cols]="cols"
        [readonly]="readonly"
        aria-label="textarea"
        (input)="onInput($event)"
        (blur)="onTouched()"
      ></textarea>
    </cds-textarea-label>
  `,
  providers: [TEXTAREA_VALUE_ACCESSOR],
})
export class UiTextAreaComponent implements ControlValueAccessor {
  @Input() label: string = ''; // Label for the textarea field
  @Input() placeholder: string = ''; // Placeholder text
  @Input() disabled: boolean = false; // Whether the textarea is disabled
  @Input() invalid: boolean = false; // Whether the textarea is in invalid state
  @Input() helperText: string = ''; // Helper text displayed below the input
  @Input() invalidText: string = ''; // Error text shown when invalid
  @Input() warn: boolean = false; // Whether the textarea has a warning state
  @Input() warnText: string = ''; // Warning text displayed
  @Input() skeleton: boolean = false; // Whether to show a skeleton loader
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of the textarea field
  @Input() theme: 'light' | 'dark' = 'dark'; // Theme of the textarea field
  @Input() readonly: boolean = false; // Whether the textarea is read-only
  @Input() rows: number = 4; // Number of rows for the textarea
  @Input() cols: number = 101; // Number of columns for the textarea

  value: string = ''; // Value of the textarea field
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
