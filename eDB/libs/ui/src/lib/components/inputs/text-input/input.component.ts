import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-text-input',
  imports: [InputModule, FormsModule],
  template: `
    <cds-text-label
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
        cdsText
        [attr.size]="size()"
        [invalid]="invalid()"
        [warn]="warn()"
        [disabled]="disabled()"
        [theme]="theme()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [autocomplete]="autocomplete()"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </cds-text-label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextInputComponent),
      multi: true,
    },
  ],
})
export class UiTextInputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
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
}
