import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';
import { ToggleModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [ToggleModule],
  template: `
    <cds-toggle
      [label]="label()"
      [onText]="onText()"
      [offText]="offText()"
      [hideLabel]="hideLabel()"
      [disabled]="disabled()"
      [size]="size()"
      [checked]="localChecked()"
      (checkedChange)="onCheckedChange($event)"
    ></cds-toggle>
  `,
})
export class UiToggleComponent {
  readonly label = input('Toggle');
  readonly onText = input('On');
  readonly offText = input('Off');
  readonly hideLabel = input(false);
  readonly disabled = input(false);
  readonly size = input<'sm' | 'md'>('sm');
  readonly checked = input(false);

  readonly localChecked = signal(this.checked());

  @Output() checkedChange = new EventEmitter<boolean>();

  constructor() {
    effect(() => {
      this.localChecked.set(this.checked());
    });
  }

  onCheckedChange(value: boolean) {
    this.localChecked.set(value);
    this.checkedChange.emit(value);
  }
}
