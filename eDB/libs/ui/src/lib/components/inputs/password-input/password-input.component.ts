import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-password-input',
  standalone: true,
  imports: [CommonModule, InputModule],
  template: `
    <cds-password-label
      [helperText]="helperText"
      [invalid]="invalid"
      [invalidText]="invalidText"
      [warn]="warn"
      [disabled]="disabled"
      [skeleton]="skeleton"
      [warnText]="warnText"
    >
      {{ label }}
      <input
        cdsPassword
        type="password"
        [size]="size"
        [invalid]="invalid"
        [warn]="warn"
        [disabled]="disabled"
        [theme]="theme"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        [readonly]="readonly"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </cds-password-label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiPasswordInputComponent),
      multi: true,
    },
  ],
})
export class UiPasswordInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() invalid: boolean = false;
  @Input() helperText: string = '';
  @Input() invalidText: string = '';
  @Input() warn: boolean = false;
  @Input() warnText: string = '';
  @Input() skeleton: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() readonly: boolean = false;
  @Input() autocomplete: string = '';

  value: string = '';

  private onChange: (value: string) => void = () => {};
  public onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
