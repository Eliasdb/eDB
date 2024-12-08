import { Component, forwardRef, input, signal } from '@angular/core';
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
      [disabled]="isDisabled()"
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
        [disabled]="isDisabled()"
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
  readonly isDisabled = input<boolean>(false); // Renamed input
  readonly invalid = input<boolean>(false);
  readonly helperText = input<string>('');
  readonly invalidText = input<string>('');
  readonly warn = input<boolean>(false);
  readonly warnText = input<string>('');
  readonly skeleton = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('lg');
  readonly theme = input<'light' | 'dark'>('dark');
  readonly readonly = input<boolean>(false);
  readonly autocomplete = input<string>('');

  private _disabled = signal(false);

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
    this._disabled.set(isDisabled); // Update the reactive signal
  }

  get disabled(): boolean {
    return this._disabled();
  }
}
