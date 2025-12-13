import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact, ContactStatus } from '../../types/contact.types';

@Component({
  selector: 'crm-contact-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3 class="text-lg font-medium mb-4">Edit Contact</h3>

    <div class="space-y-4">
      @for (f of fields; track f.key) {
        <div class="space-y-1">
          <label
            class="block text-xs font-medium text-gray-600"
            [attr.for]="f.key + '-input'"
          >
            {{ f.label }}
          </label>

          @if (f.type !== 'select') {
            <input
              [type]="f.type"
              [(ngModel)]="draft[f.key]"
              [id]="f.key + '-input'"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          } @else {
            <select
              [(ngModel)]="draft.status"
              [id]="f.key + '-input'"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              @for (s of statuses; track s) {
                <option [ngValue]="s">{{ s }}</option>
              }
            </select>
          }
        </div>
      }
    </div>

    <!-- action buttons -->
    <div class="flex justify-end gap-2 pt-6">
      <button
        class="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
        type="button"
        (click)="cancelRequested.emit()"
      >
        Cancel
      </button>
      <button
        class="px-3 py-1.5 rounded-md text-sm text-white bg-gray-900 hover:bg-gray-800"
        type="button"
        (click)="save.emit(draft)"
      >
        Save
      </button>
    </div>
  `,
})
export class ContactEditFormComponent implements OnChanges {
  /* ---------- Inputs / Outputs ---------- */
  @Input({ required: true }) contact!: Contact;
  @Output() save = new EventEmitter<Contact>();
  @Output() cancelRequested = new EventEmitter<void>();

  /* ---------- Working copy ---------- */
  draft: Contact = {} as Contact;

  /* ---------- Field definitions ---------- */
  readonly statuses: ContactStatus[] = [
    'Lead',
    'Prospect',
    'Customer',
    'Archived',
  ];

  readonly fields = [
    { key: 'firstName', label: 'First name', type: 'text' },
    { key: 'lastName', label: 'Last name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'status', label: 'Status', type: 'select' },
  ] as const;

  /* ---------- Lifecycle ---------- */
  ngOnChanges() {
    /** fresh shallow-copy each time the input changes */
    this.draft = { ...this.contact };
  }
}
