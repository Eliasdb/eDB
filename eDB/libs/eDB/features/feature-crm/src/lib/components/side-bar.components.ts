/* ------------------------------------------------------------------ */
/* contact-sidebar.component.ts                                       */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  model,
  signal,
} from '@angular/core';

import { UiIconButtonComponent } from '@edb/shared-ui';
import { ActivityItem, Contact, ContactStatus } from '../types/contact.types';
import {
  AddActivityFormComponent,
  NewActivity,
} from './add-activity-form.component';
import { ContactEditFormComponent } from './contact-edit-form.component';

@Component({
  selector: 'crm-contact-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ContactEditFormComponent,
    AddActivityFormComponent,
    UiIconButtonComponent,
  ],
  /* ─────────────────────────────────────────────────────────────── */
  /* template                                                      */
  /* ─────────────────────────────────────────────────────────────── */
  template: `
    <!-- Back-drop (only when NOT used inside a <mat-drawer>) -->
    @if (!embedded) {
      <div
        class="fixed inset-0 bg-black/40 z-[6500]"
        [class.opacity-0]="!isOpen()"
        [class.pointer-events-none]="!isOpen()"
        [class.transition-opacity]="ready"
        [class.duration-300]="ready"
        (click)="close()"
      ></div>
    }

    <!-- Panel -->
    <aside
      class="bg-white shadow-xl border-l flex flex-col h-full w-[360px] sm:w-[400px]"
      [class.fixed]="!embedded"
      [class.top-0]="!embedded"
      [class.right-0]="!embedded"
      [class.z-[6600]]="!embedded"
      [class.transform]="!embedded"
      [class.translate-x-full]="!embedded && !isOpen()"
      [ngClass]="{
        'transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]':
          !embedded && ready,
      }"
      (click)="$event.stopPropagation()"
    >
      <!-- ░░ Header ░░ -->
      <header class="p-6 border-b relative">
        <h2 class="text-2xl font-semibold">{{ contact()?.name || '—' }}</h2>
        <p class="text-sm text-gray-500">
          {{ contact()?.email || 'no-email@example.com' }}
        </p>

        <!-- status pills -->
        <div class="flex gap-2 mt-4 flex-wrap">
          <ng-container *ngFor="let s of statuses">
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
          </ng-container>
        </div>

        <!-- toolbar -->
        <div class="flex gap-2 mt-4">
          <button
            *ngFor="let btn of ['Edit', 'Email', 'Archive']"
            class="px-3 py-1.5 rounded-md border text-sm transition-colors duration-200"
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
        </div>

        <!-- close (stand-alone mode only; mat-drawer has its own backdrop) -->
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

      <!-- ░░ Body ░░ -->
      <section class="p-6 overflow-y-auto flex-1">
        <!-- view / edit switch -->
        <ng-container *ngIf="!editMode(); else editArea">
          <!-- title row -->
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

          <!-- timeline OR add form -->
          <ng-container *ngIf="!showAdd(); else addForm">
            <div
              *ngFor="let a of contact()?.activity ?? exampleActivity"
              class="mb-6"
            >
              <time class="block text-xs text-gray-400 w-12">{{ a.date }}</time>
              <h4 class="font-medium text-sm mt-1">{{ a.title }}</h4>
              <p *ngIf="a.text" class="text-xs text-gray-600 mt-0.5">
                {{ a.text }}
              </p>
            </div>
          </ng-container>

          <ng-template #addForm>
            <crm-add-activity-form
              (saveActivity)="handleNewActivity($event); showAdd.set(false)"
              (cancel)="showAdd.set(false)"
            />
          </ng-template>
        </ng-container>

        <!-- edit template -->
        <ng-template #editArea>
          <crm-contact-edit-form
            [contact]="draft"
            (save)="saveEdit($event)"
            (cancel)="cancelEdit()"
          />
        </ng-template>
      </section>
    </aside>
  `,
  /* ─────────────────────────────────────────────────────────────── */
  /* styles                                                         */
  /* ─────────────────────────────────────────────────────────────── */
  styles: [
    `
      .translate-x-full {
        transform: translateX(100%);
      }
    `,
  ],
})
export class ContactSidebarComponent implements AfterViewInit {
  /* external flag -------------------------------------------------- */
  @Input({ alias: 'embedded' }) embedded = false;

  /* signals -------------------------------------------------------- */
  readonly contact = model<Contact>();
  readonly isOpen = signal(false);
  readonly editMode = signal(false);
  readonly showAdd = signal(false);

  draft: Contact = {} as Contact;
  readonly statuses: ContactStatus[] = ['Lead', 'Customer', 'Archived'];

  /* life-cycle ----------------------------------------------------- */
  ready = false;
  ngAfterViewInit() {
    setTimeout(() => (this.ready = true));
  }

  /* public API ----------------------------------------------------- */
  open(data: Contact) {
    this.contact.set(data);
    this.resetDraft();
    this.isOpen.set(true);
  }
  close() {
    this.isOpen.set(false);
    this.editMode.set(false);
    this.showAdd.set(false);
    this.closed.emit();
  }

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Contact>();

  /* toolbar logic -------------------------------------------------- */
  onToolbar(action: string) {
    if (action === 'Edit') {
      this.editMode.set(!this.editMode());
      if (this.editMode()) this.resetDraft();
    }
  }
  isActive(btn: string) {
    return btn === 'Edit' && this.editMode();
  }

  /* helpers -------------------------------------------------------- */
  private resetDraft() {
    this.draft = { ...(this.contact() as Contact) };
  }
  cancelEdit() {
    this.editMode.set(false);
    this.resetDraft();
  }
  saveEdit(updated: Contact) {
    this.contact.set(updated);
    this.updated.emit(updated);
    this.editMode.set(false);
  }

  handleNewActivity(item: NewActivity) {
    const current = this.contact();
    if (!current) return;
    this.contact.set({
      ...current,
      activity: [
        { date: item.date, title: item.title, text: item.details },
        ...(current.activity ?? []),
      ],
    });
  }

  @HostListener('document:keydown.escape') onEsc() {
    if (!this.embedded && this.isOpen()) this.close();
  }

  /* demo ----------------------------------------------------------- */
  readonly exampleActivity: ActivityItem[] = [
    { date: 'Jun', title: 'Met at trade show', text: 'Marketing conference.' },
    { date: 'Jun', title: 'Call', text: 'Confirmed a time for April 5.' },
    { date: 'Mar', title: 'Demo call scheduled', text: 'Date: Apr 6.' },
    { date: 'Feb', title: 'Discussed integration needs', text: 'Details …' },
  ];
}
