import { Component, EventEmitter, Output, input } from '@angular/core';
import { SearchModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-search',
  imports: [SearchModule],
  template: `
    <cds-search
      [theme]="theme()"
      [placeholder]="placeholder()"
      [autocomplete]="autocomplete()"
      [disabled]="disabled()"
      [size]="size()"
      (valueChange)="valueChange.emit($event)"
      (clear)="clear.emit()"
      [skeleton]="skeleton()"
      [expandable]="expandable()"
    ></cds-search>
  `,
})
export class UiSearchComponent {
  readonly theme = input<'light' | 'dark'>('light');
  readonly placeholder = input<string>('Search');
  readonly autocomplete = input<string>('off');
  readonly disabled = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly skeleton = input<boolean>(false);
  readonly expandable = input<boolean>(false);

  @Output() valueChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
}
