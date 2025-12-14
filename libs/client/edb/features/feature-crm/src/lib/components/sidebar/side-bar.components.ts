import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  model,
  Output,
  signal,
} from '@angular/core';

import {
  UiIconButtonComponent,
  UiSlideInSidebarComponent,
} from '@edb/shared-ui';

import {
  ActivityItem,
  Contact,
  ContactStatus,
} from '../../types/contact.types';

import {
  AddActivityFormComponent,
  NewActivity,
} from '../forms/add-activity-form.component';
import { ContactEditFormComponent } from '../forms/contact-edit-form.component';

@Component({
  selector: 'crm-contact-sidebar',
  imports: [
    UiSlideInSidebarComponent,
    UiIconButtonComponent,
    ContactEditFormComponent,
    AddActivityFormComponent,
    NgClass,
  ],
  template: `
    <ui-slide-in-sidebar
      [opened]="isOpen()"
      (closed)="close()"
      [embedded]="embedded"
      class="w-[360px] sm:w-[400px] bg-white text-black"
    >
      <div class="flex flex-col h-full border-l shadow-xl">
        <!-- ░ Header ░ -->
        <header class="p-6 border-b relative">
          <h2 class="text-2xl font-semibold">
            {{ contact()?.companyName }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ contact()?.email || 'no-email@example.com' }}
          </p>

          <!-- status chips -->
          <div class="flex flex-wrap gap-2 mt-4">
            @for (s of statuses; track s) {
              <span
                class="rounded-md px-2 py-0.5 text-xs font-medium border"
                [ngClass]="{
                  'bg-gray-900 text-white border-gray-900':
                    (contact()?.status ?? 'Lead') === s,
                  'bg-gray-100 text-gray-600 border-gray-200':
                    (contact()?.status ?? 'Lead') !== s,
                }"
              >
                {{ s }}
              </span>
            }
          </div>

          <!-- toolbar -->
          <div class="flex gap-2 mt-4">
            @for (btn of ['Edit', 'Email', 'Archive']; track btn) {
              <button
                class="px-3 py-1.5 rounded-md border text-sm transition-colors"
                [ngClass]="{
                  'bg-[var(--accent)] text-[var(--accent-complimentary)] border-[var(--accent)]':
                    isActive(btn),
                  'bg-transparent text-gray-800 border-gray-300 hover:bg-gray-50 active:bg-gray-100':
                    !isActive(btn),
                }"
                (click)="onToolbar(btn)"
              >
                {{ btn }}
              </button>
            }
          </div>

          <!-- close icon (stand-alone mode) -->
          @if (!embedded) {
            <ui-icon-button
              icon="faTimes"
              kind="ghost"
              size="sm"
              description="Close sidebar"
              class="absolute top-4 right-4"
              (iconButtonClick)="close()"
            />
          }
        </header>

        <!-- ░ Body ░ -->
        <section class="p-6 overflow-y-auto flex-1">
          @if (!editMode()) {
            <!-- Activity list / add-form toggle -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">Activity</h3>
              <ui-icon-button
                icon="faPlus"
                kind="ghost"
                size="sm"
                description="Add activity"
                [class.opacity-0]="showAdd()"
                [class.pointer-events-none]="showAdd()"
                (iconButtonClick)="showAdd.set(true)"
              />
            </div>

            @if (!showAdd()) {
              @for (
                a of contact()?.activity ?? exampleActivity;
                track a.title
              ) {
                <div class="mb-6">
                  <time class="block text-xs text-gray-400 w-12">{{
                    a.date
                  }}</time>
                  <h4 class="font-medium text-sm mt-1">{{ a.title }}</h4>
                  @if (a.text) {
                    <p class="text-xs text-gray-600 mt-0.5">{{ a.text }}</p>
                  }
                </div>
              }
            } @else {
              <crm-add-activity-form
                (saveActivity)="handleNewActivity($event); showAdd.set(false)"
                (cancelRequested)="showAdd.set(false)"
              />
            }
          } @else {
            <crm-contact-edit-form
              [contact]="draft"
              (save)="saveEdit($event)"
              (cancelRequested)="cancelEdit()"
            />
          }
        </section>
      </div>
    </ui-slide-in-sidebar>
  `,
})
export class ContactSidebarComponent implements AfterViewInit {
  @Input() embedded = false;

  readonly contact = model<Contact>();
  readonly isOpen = signal(false);
  readonly editMode = signal(false);
  readonly showAdd = signal(false);

  draft: Contact = {} as Contact;
  readonly statuses: ContactStatus[] = ['Lead', 'Customer', 'Archived'];

  ngAfterViewInit(): void {
    setTimeout(() => (this.ready = true));
  }
  private ready = false;

  open(data: Contact): void {
    this.contact.set(data);
    this.resetDraft();
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.editMode.set(false);
    this.showAdd.set(false);
    this.closed.emit();
  }

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Contact>();

  onToolbar(action: string): void {
    if (action === 'Edit') {
      this.editMode.set(!this.editMode());
      if (this.editMode()) this.resetDraft();
    }
  }

  isActive(btn: string): boolean {
    return btn === 'Edit' && this.editMode();
  }

  private resetDraft(): void {
    this.draft = { ...(this.contact() as Contact) };
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.resetDraft();
  }

  saveEdit(updated: Contact): void {
    this.contact.set(updated);
    this.updated.emit(updated);
    this.editMode.set(false);
  }

  handleNewActivity(item: NewActivity): void {
    const cur = this.contact();
    if (!cur) return;
    this.contact.set({
      ...cur,
      activity: [
        { date: item.date, title: item.title, text: item.details },
        ...(cur.activity ?? []),
      ],
    });
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (!this.embedded && this.isOpen()) this.close();
  }

  readonly exampleActivity: ActivityItem[] = [
    { date: 'Jun', title: 'Met at trade show', text: 'Marketing conference.' },
    { date: 'Jun', title: 'Call', text: 'Confirmed a time for April 5.' },
    { date: 'Mar', title: 'Demo call scheduled', text: 'Date: Apr 6.' },
    { date: 'Feb', title: 'Discussed integration needs', text: 'Details…' },
  ];
}
