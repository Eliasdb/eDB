import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InputModule } from 'carbon-components-angular';

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
        [invalid]="invalid"
        [disabled]="disabled"
        [theme]="theme"
        [rows]="rows"
        [cols]="cols"
        [readonly]="readonly"
        aria-label="textarea"
      ></textarea>
    </cds-textarea-label>
  `,
})
export class TextAreaComponent {
  @Input() label: string = ''; // Label for the textarea field
  @Input() placeholder: string = ''; // Placeholder text
  @Input() value: string = ''; // Value of the textarea field
  @Input() disabled: boolean = false; // Whether the textarea is disabled
  @Input() invalid: boolean = false; // Whether the textarea is in invalid state
  @Input() helperText: string = ''; // Helper text displayed below the input
  @Input() invalidText: string = ''; // Error text shown when invalid
  @Input() warn: boolean = false; // Whether the textarea has a warning state
  @Input() warnText: string = ''; // Warning text displayed
  @Input() skeleton: boolean = false; // Whether to show a skeleton loader
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of the textarea field
  @Input() theme: 'light' | 'dark' = 'light'; // Theme of the textarea field
  @Input() readonly: boolean = false; // Whether the textarea is read-only
  @Input() autocomplete: string = ''; // Autocomplete attribute for the textarea
  @Input() rows: number = 4; // Number of rows for the textarea
  @Input() cols: number = 50; // Number of columns for the textarea
}
