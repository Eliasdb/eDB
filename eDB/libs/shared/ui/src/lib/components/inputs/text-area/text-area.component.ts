import { Component, forwardRef, input, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

export const TEXTAREA_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiTextAreaComponent),
  multi: true,
};

@Component({
  selector: 'ui-textarea',
  imports: [InputModule],
  template: `
    <cds-textarea-label
      [helperText]="helperText()"
      [invalid]="invalid()"
      [invalidText]="invalidText()"
      [warn]="warn()"
      [disabled]="disabled()"
      [skeleton]="skeleton()"
      [warnText]="warnText()"
    >
      {{ label() }}
      <textarea
        cdsTextArea
        [placeholder]="placeholder()"
        [value]="value"
        [disabled]="disabled()"
        [theme]="theme()"
        [rows]="rows()"
        [cols]="cols()"
        [readonly]="readonly()"
        aria-label="textarea"
        (input)="onInput($event)"
        (blur)="onTouched()"
      ></textarea>
    </cds-textarea-label>
  `,
  providers: [TEXTAREA_VALUE_ACCESSOR],
})
export class UiTextAreaComponent implements ControlValueAccessor {
  readonly label = input<string>(''); // Label for the textarea field
  readonly placeholder = input<string>(''); // Placeholder text
  readonly disabled = input<boolean>(false); // Whether the textarea is disabled
  readonly invalid = input<boolean>(false); // Whether the textarea is in invalid state
  readonly helperText = input<string>(''); // Helper text displayed below the input
  readonly invalidText = input<string>(''); // Error text shown when invalid
  readonly warn = input<boolean>(false); // Whether the textarea has a warning state
  readonly warnText = input<string>(''); // Warning text displayed
  readonly skeleton = input<boolean>(false); // Whether to show a skeleton loader
  readonly size = input<'sm' | 'md' | 'lg'>('md'); // Size of the textarea field
  readonly theme = input<'light' | 'dark'>('dark'); // Theme of the textarea field
  readonly readonly = input<boolean>(false); // Whether the textarea is read-only
  readonly rows = input<number>(4);
  readonly cols = input<number>(101);

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

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
