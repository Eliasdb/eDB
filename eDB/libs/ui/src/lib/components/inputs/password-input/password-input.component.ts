import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
      />
    </cds-password-label>
  `,
})
export class UiPasswordInputComponent {
  @Input() label: string = ''; // Label for the input field
  @Input() placeholder: string = ''; // Placeholder text
  @Input() value: string = ''; // Value of the password field
  @Input() disabled: boolean = false; // Whether the input is disabled
  @Input() invalid: boolean = false; // Whether the input is invalid
  @Input() helperText: string = ''; // Helper text displayed below the input
  @Input() invalidText: string = ''; // Error message when input is invalid
  @Input() warn: boolean = false; // Whether the input has a warning state
  @Input() warnText: string = ''; // Warning message
  @Input() skeleton: boolean = false; // Whether to show a skeleton loader
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of the password input field
  @Input() theme: 'light' | 'dark' = 'light'; // Theme of the password input field
  @Input() readonly: boolean = false; // Whether the input is read-only
  @Input() autocomplete: string = ''; // Autocomplete attribute for the input
}
