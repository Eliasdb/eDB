import { Component, EventEmitter, input, Output } from '@angular/core';
import { ComboBoxModule, ListItem } from 'carbon-components-angular';

@Component({
  selector: 'ui-combobox',
  standalone: true,
  imports: [ComboBoxModule],
  template: `
    <cds-combo-box
      [invalid]="invalid()"
      [invalidText]="invalidText()"
      [label]="label()"
      [hideLabel]="hideLabel()"
      [warn]="warn()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [size]="size()"
      [helperText]="helperText()"
      [appendInline]="appendInline()"
      [items]="items()"
      [theme]="theme()"
      [selectionFeedback]="selectionFeedback()"
      [dropUp]="dropUp()"
      [fluid]="fluid()"
      type="multi"
      (selected)="selected.emit($event)"
      (submit)="submit.emit($event)"
      (clear)="clear.emit($event)"
      class="rounded-md"
    >
      <cds-dropdown-list></cds-dropdown-list>
    </cds-combo-box>
  `,
})
export class UiComboboxComponent {
  // Define input signals with union types for allowed options
  readonly invalid = input<boolean>(false);
  readonly invalidText = input<string>('');
  readonly label = input<string>('Select options');
  readonly hideLabel = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);

  // Allowed sizes: "sm", "md", "lg". Default is "md".
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly helperText = input<string>('');
  // Allowed for appendInline: true or false
  readonly appendInline = input<boolean>(false);
  // Items: adjust the type as needed.
  readonly items = input<ListItem[]>([
    {
      content: '',
      selected: false,
    },
  ]);

  // Allowed themes: "light" or "dark". Default is "dark".
  readonly theme = input<'light' | 'dark'>('dark');

  // Allowed selectionFeedback: "top", "fixed", or "top-after-reopen". Default is "top".
  readonly selectionFeedback = input<'top' | 'fixed' | 'top-after-reopen'>(
    'top-after-reopen',
  );

  readonly dropUp = input<boolean>(false);
  readonly fluid = input<boolean>(false);

  // Define outputs for events
  @Output() selected = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
}
