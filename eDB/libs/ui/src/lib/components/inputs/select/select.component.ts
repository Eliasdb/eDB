import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [SelectModule, FormsModule],
  template: `
    <cds-select
      [skeleton]="skeleton"
      [disabled]="disabled"
      [readonly]="readonly"
      [size]="size"
      [invalid]="invalid"
      [invalidText]="invalidText"
      [warn]="warn"
      [warnText]="warnText"
      [label]="label"
      [helperText]="helperText"
      [theme]="theme"
      [(ngModel)]="model"
      [display]="display"
    >
      <option value="default" disabled selected hidden>Choose an option</option>
      <option value="solong">
        A much longer option that is worth having around to check how text flows
      </option>
      <optgroup label="Category 1">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </optgroup>
      <optgroup label="Category 2">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </optgroup>
    </cds-select>
  `,
})
export class UiSelectComponent {
  @Input() label: string = ''; // Label for the select input
  @Input() helperText: string = ''; // Helper text
  @Input() invalidText: string = ''; // Invalid text
  @Input() warnText: string = ''; // Warn text
  @Input() theme: 'light' | 'dark' = 'light'; // Theme
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of the select
  @Input() disabled: boolean = false; // Whether the select is disabled
  @Input() readonly: boolean = false; // Whether the select is readonly
  @Input() invalid: boolean = false; // Whether the input is in an invalid state
  @Input() warn: boolean = false; // Whether the input has a warning state
  @Input() skeleton: boolean = false; // Whether to show skeleton loader
  @Input() model: any; // Model for ngModel
  @Input() display: 'inline' | 'default' = 'default'; // Control the display type (inline or default)
}
