import { Component, EventEmitter, Output, input } from '@angular/core';
import { DropdownModule, I18nModule } from 'carbon-components-angular';

// ✅ Type alias for dropdown items
type DropdownItem = { content: string; selected: boolean };

@Component({
  selector: 'ui-dropdown',
  imports: [DropdownModule, I18nModule],
  template: `
    <cds-dropdown
      [label]="label()"
      [hideLabel]="hideLabel()"
      [skeleton]="skeleton()"
      [helperText]="helperText()"
      [size]="size()"
      [dropUp]="dropUp()"
      [invalid]="invalid()"
      [invalidText]="invalidText()"
      [warn]="warn()"
      [warnText]="warnText()"
      [theme]="theme()"
      placeholder="Select"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [fluid]="fluid()"
      (selected)="handleSelected($event)"
      (onClose)="handleClose($event)"
    >
      <cds-dropdown-list [items]="items()"></cds-dropdown-list>
    </cds-dropdown>
  `,
})
export class UiDropdownComponent {
  readonly label = input<string>('');
  readonly hideLabel = input<boolean>(false);
  readonly skeleton = input<boolean>(false);
  readonly helperText = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly dropUp = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly invalidText = input<string>('Invalid selection');
  readonly warn = input<boolean>(false);
  readonly warnText = input<string>('Warning: Check your selection');
  readonly theme = input<'light' | 'dark'>('light');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly fluid = input<boolean>(false);

  readonly items = input<DropdownItem[]>([
    { content: 'Option 1', selected: false },
    { content: 'Option 2', selected: false },
    { content: 'Option 3', selected: false },
  ]);

  // ✅ Output names follow Angular conventions
  @Output() selectionChange = new EventEmitter<DropdownItem>();
  @Output() dropdownClosed = new EventEmitter<void>();

  handleSelected(event: unknown): void {
    this.selectionChange.emit(event as DropdownItem);
  }

  handleClose(_: unknown): void {
    this.dropdownClosed.emit();
  }
}
