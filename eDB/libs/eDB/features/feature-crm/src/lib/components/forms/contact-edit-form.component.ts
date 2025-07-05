import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
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
      <ng-container *ngFor="let f of fields">
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">
            {{ f.label }}
          </label>

          <!-- text / email / tel -->
          <input
            *ngIf="f.type !== 'select'"
            [type]="f.type"
            [(ngModel)]="draft[f.key]"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <!-- status -->
          <select
            *ngIf="f.type === 'select'"
            [(ngModel)]="draft.status"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option *ngFor="let s of statuses" [ngValue]="s">{{ s }}</option>
          </select>
        </div>
      </ng-container>
    </div>

    <!-- buttons -->
    <div class="flex justify-end gap-2 pt-6">
      <button
        class="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
        (click)="cancel.emit()"
      >
        Cancel
      </button>
      <button
        class="px-3 py-1.5 rounded-md text-sm text-white bg-gray-900 hover:bg-gray-800"
        (click)="save.emit(draft)"
      >
        Save
      </button>
    </div>
  `,
})
export class ContactEditFormComponent implements OnChanges {
  /* API */
  @Input({ required: true }) contact!: Contact;
  @Output() save = new EventEmitter<Contact>();
  @Output() cancel = new EventEmitter<void>();

  /* editable copy */
  draft: Contact = {} as Contact;

  /* meta */
  readonly statuses: ContactStatus[] = ['Lead', 'Customer', 'Archived'];
  readonly fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'status', label: 'Status', type: 'select' },
  ] as const;

  /* sync input → draft */
  ngOnChanges(_: SimpleChanges) {
    this.draft = { ...this.contact };
  }
}
