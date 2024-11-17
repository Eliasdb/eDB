import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-text-input',
  standalone: true,
  imports: [CommonModule, InputModule, FormsModule],
  template: `
    <cds-text-label
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
        cdsText
        [size]="size"
        [invalid]="invalid"
        [warn]="warn"
        [disabled]="disabled"
        [theme]="theme"
        [placeholder]="placeholder"
        [readonly]="readonly"
        [autocomplete]="autocomplete"
        [(ngModel)]="value"
      />
    </cds-text-label>
  `,
})
export class UiTextInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() value: string = '';
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
}
