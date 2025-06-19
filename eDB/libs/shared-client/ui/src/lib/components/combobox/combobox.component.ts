import { Component, EventEmitter, Output, input } from '@angular/core';
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
      (selected)="handleSelected($event)"
      (submit)="handleSubmit($event)"
      (clear)="handleClear()"
    >
      <cds-dropdown-list></cds-dropdown-list>
    </cds-combo-box>
  `,
})
export class UiComboboxComponent {
  readonly invalid = input<boolean>(false);
  readonly invalidText = input<string>('');
  readonly label = input<string>('Select options');
  readonly hideLabel = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly helperText = input<string>('');
  readonly appendInline = input<boolean>(false);
  readonly items = input<ListItem[]>([{ content: '', selected: false }]);
  readonly theme = input<'light' | 'dark'>('light');
  readonly selectionFeedback = input<'top' | 'fixed' | 'top-after-reopen'>(
    'top-after-reopen',
  );
  readonly dropUp = input<boolean>(false);
  readonly fluid = input<boolean>(false);

  // ✅ Output events
  @Output() comboBoxSelected = new EventEmitter<ListItem | ListItem[]>();
  @Output() comboBoxSubmit = new EventEmitter<ListItem>();
  @Output() comboBoxClear = new EventEmitter<void>();

  // ✅ Accept both single & multi select outputs
  handleSelected(event: ListItem | ListItem[]): void {
    this.comboBoxSelected.emit(event);
  }

  // ✅ Grab the selected value from the submit payload
  handleSubmit(event: { value: ListItem }): void {
    this.comboBoxSubmit.emit(event.value);
  }

  // ✅ Clear handler - emit void
  handleClear(): void {
    this.comboBoxClear.emit();
  }
}
