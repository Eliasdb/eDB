/* add-activity-form.component.ts
   ─────────────────────────────────────────────────────────────────── */
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  UiButtonComponent,
  UiDatePickerComponent,
  UiTextAreaComponent,
  UiTextInputComponent,
} from '@edb/shared-ui';

/** Payload bubbled up to sidebar */
export interface NewActivity {
  date: string; // "YYYY-MM-DD"
  title: string;
  details: string;
}

@Component({
  selector: 'crm-add-activity-form',
  imports: [
    FormsModule,
    UiDatePickerComponent,
    UiTextInputComponent,
    UiTextAreaComponent,
    UiButtonComponent,
  ],
  template: `
    <div class="mt-4 border rounded-md p-4 space-y-6 bg-gray-50">
      <div class="w-full">
        <ui-date-picker
          class="w-full"
          label="Date"
          size="sm"
          [value]="date"
          (valueChange)="date = $event"
        ></ui-date-picker>
      </div>

      <div>
        <ui-text-input
          label="Title"
          placeholder="Short headline"
          size="sm"
          theme="light"
          [(ngModel)]="title"
        ></ui-text-input>
      </div>

      <div>
        <ui-textarea
          label="Details"
          placeholder="What did you do?"
          [rows]="4"
          theme="light"
          [(ngModel)]="details"
        ></ui-textarea>
      </div>

      <div class="flex justify-end gap-2">
        <ui-button
          variant="ghost"
          size="sm"
          (buttonClick)="cancelRequested.emit()"
        >
          Cancel
        </ui-button>

        <ui-button
          variant="primary"
          size="sm"
          [disabled]="!canSave()"
          (buttonClick)="save()"
        >
          Save
        </ui-button>
      </div>
    </div>
  `,
})
export class AddActivityFormComponent {
  /* form state */
  date: string | null = null;
  title = '';
  details = '';

  /* outputs */
  @Output() saveActivity = new EventEmitter<NewActivity>();
  @Output() cancelRequested = new EventEmitter<void>();

  /* helpers */
  canSave() {
    return !!this.date && this.title.trim() && this.details.trim();
  }

  save() {
    if (!this.canSave() || !this.date) return;
    this.saveActivity.emit({
      date: this.date,
      title: this.title.trim(),
      details: this.details.trim(),
    });

    /* reset for next add */
    this.date = null;
    this.title = '';
    this.details = '';
  }
}
