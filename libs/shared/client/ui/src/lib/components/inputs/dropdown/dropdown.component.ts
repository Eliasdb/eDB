import { Component, EventEmitter, Output, input } from '@angular/core';
import { DropdownModule, I18nModule } from 'carbon-components-angular';

// ✅ Type alias for dropdown items
type DropdownItem = { content: string; selected: boolean };
type DropdownSelectionEvent =
  | DropdownItem
  | DropdownItem[]
  | { item?: DropdownItem; value?: DropdownItem | string; content?: string };

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
      (onClose)="handleClose()"
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
    const item = this.normalizeSelection(event as DropdownSelectionEvent);
    if (item) {
      this.selectionChange.emit(item);
    }
  }

  handleClose(): void {
    this.dropdownClosed.emit();
  }

  private normalizeSelection(event: DropdownSelectionEvent): DropdownItem | null {
    if (Array.isArray(event)) {
      return event.find((item) => item.selected) ?? event[0] ?? null;
    }

    if (event && typeof event === 'object') {
      if ('item' in event && event.item) {
        return event.item;
      }

      if ('value' in event && event.value) {
        return typeof event.value === 'string'
          ? { content: event.value, selected: true }
          : event.value;
      }

      if ('content' in event && typeof event.content === 'string') {
        return event as DropdownItem;
      }
    }

    return null;
  }
}
