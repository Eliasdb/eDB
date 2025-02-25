import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-search',
  imports: [SearchModule],
  template: `
    <cds-search
      [theme]="theme"
      [placeholder]="placeholder"
      [autocomplete]="autocomplete"
      [disabled]="disabled"
      [size]="size"
      (valueChange)="valueChange.emit($event)"
      (clear)="clear.emit()"
      [skeleton]="skeleton"
      [expandable]="expandable"
    ></cds-search>
  `,
})
export class UiSearchComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() placeholder: string = 'Search';
  @Input() autocomplete: string = 'off';
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() skeleton: boolean = false;
  @Input() expandable: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
}
