import { Component, EventEmitter, Output, effect, input } from '@angular/core';
import { DatePickerModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-date-picker',
  imports: [DatePickerModule],
  template: `
    <div class="w-full">
      <cds-date-picker
        style="display: block; width: 100%"
        [label]="label()"
        [placeholder]="placeholder()"
        [language]="language()"
        [size]="size()"
        [theme]="theme()"
        [value]="valueArr"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="invalid()"
        [invalidText]="invalidText()"
        [warn]="warn()"
        [warnText]="warnText()"
        [dateFormat]="dateFormat()"
        (valueChange)="forward($event)"
      ></cds-date-picker>
    </div>
  `,
})
export class UiDatePickerComponent {
  /* ───────────────── signal inputs ──────────────────────────────── */
  readonly label = input<string>('Date');
  readonly placeholder = input<string>('yyyy-mm-dd');
  readonly language = input<string>('en');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly theme = input<'light' | 'dark'>('light');
  readonly value = input<string | null>(null); // single value

  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly invalidText = input<string>('Invalid date');
  readonly warn = input<boolean>(false);
  readonly warnText = input<string>('Warning');
  readonly dateFormat = input<string>('Y-m-d');

  /* ───────────────── outputs ─────────────────────────────────────── */
  @Output() valueChange = new EventEmitter<string | null>();

  /* ───────────────── internal stable array ───────────────────────── */
  readonly valueArr: (string | Date)[] = [];

  constructor() {
    /* keep array content in sync without changing its reference */
    effect(() => {
      const v = this.value();
      this.valueArr.length = 0;
      if (v != null) this.valueArr.push(v);
    });
  }

  /* ───────────────── handler ─────────────────────────────────────── */
  forward(arr: (string | Date)[]) {
    let v = arr?.[0] ?? null;
    if (v instanceof Date) v = v.toISOString().slice(0, 10);
    this.valueChange.emit(v);
  }
}
