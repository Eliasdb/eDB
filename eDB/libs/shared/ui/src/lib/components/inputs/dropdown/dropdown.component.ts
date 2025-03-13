import { Component, EventEmitter, Output, input } from '@angular/core';
import { DropdownModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-dropdown',
  imports: [DropdownModule],
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
      (onClose)="handleOnClose($event)"
    >
      <cds-dropdown-list [items]="items()"></cds-dropdown-list>
    </cds-dropdown>
  `,
})
export class UiDropdownComponent {
  // Inputs using the new "input" helper
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

  // The list of dropdown items. Each item must have a "content" and "selected" property.
  readonly items = input<Array<{ content: string; selected: boolean }>>([
    { content: 'Option 1', selected: false },
    { content: 'Option 2', selected: false },
    { content: 'Option 3', selected: false },
  ]);

  // Outputs
  @Output() selectedEvent = new EventEmitter<any>();
  @Output() onCloseEvent = new EventEmitter<any>();

  // Event handlers that emit output events
  handleSelected(event: any) {
    console.log('Selected event:', event);
    this.selectedEvent.emit(event);
  }

  handleOnClose(event: any) {
    console.log('Dropdown closed:', event);
    this.onCloseEvent.emit(event);
  }
}
