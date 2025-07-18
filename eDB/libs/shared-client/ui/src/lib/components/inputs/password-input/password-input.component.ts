import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-password-input',
  imports: [InputModule],
  template: `
    <cds-password-label
      [helperText]="helperText()"
      [invalid]="invalid()"
      [invalidText]="invalidText()"
      [warn]="warn()"
      [disabled]="disabled()"
      [skeleton]="skeleton()"
      [warnText]="warnText()"
    >
      {{ label() }}
      <input
        cdsPassword
        type="password"
        [size]="size()"
        [invalid]="invalid()"
        [warn]="warn()"
        [disabled]="disabled()"
        [theme]="theme()"
        [placeholder]="placeholder()"
        [autocomplete]="autocomplete()"
        [readonly]="readonly()"
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
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly helperText = input<string>('');
  readonly invalidText = input<string>('');
  readonly warn = input<boolean>(false);
  readonly warnText = input<string>('');
  readonly skeleton = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly theme = input<'light' | 'dark'>('dark');
  readonly readonly = input<boolean>(false);
  readonly autocomplete = input<string>('');

  value = '';

  private onChange: (value: string) => void = () => {
    /** no-op */
  };

  public onTouched: () => void = () => {
    /** no-op */
  };

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
}
