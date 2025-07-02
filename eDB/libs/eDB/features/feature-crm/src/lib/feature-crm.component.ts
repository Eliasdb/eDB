/* ------------------------------------------------------------------ */
/* crm-contacts-page.component.ts – fires the toggle request          */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CustomModalService,
  SidebarToggleService,
  UiTableComponent,
  UiTabsComponent,
  UiTextInputComponent,
} from '@edb/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import { ContactSidebarComponent } from './components/side-bar.components';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'crm-contacts-page',
  standalone: true,
  imports: [
    CommonModule,

    /* page-level ui */
    UiTableComponent,
    UiTabsComponent,
    UiTextInputComponent,
    ReactiveFormsModule,
    ContactSidebarComponent,
    ReactiveFormsModule, // <-- reactive forms

    /* tiny menu button */
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <section class="pt-20">
      <!-- menu button – visible on small screens / whenever you need -->
      <button
        mat-icon-button
        (click)="toggleShellSidebar()"
        class="mb-4 md:hidden"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <ui-tabs [tabs]="tabs()"></ui-tabs>

      <!-- main table -->
      <ng-template #contactsContent>
        <ui-table
          title="Contacts"
          description="All your business contacts"
          [model]="model()"
          [showToolbar]="true"
          [showButton]="true"
          primaryActionLabel="Add Contact"
          (primaryActionClick)="openAddContactModal()"
          (rowClicked)="handleRowClick($event)"
        ></ui-table>
      </ng-template>

      <!-- sidebar (self-controlled) -->
      <crm-contact-sidebar
        #sidebar
        (closed)="onSidebarClosed()"
      ></crm-contact-sidebar>

      <!-- modal template (hidden) -->
      <ng-template #addContactForm>
        <form [formGroup]="addContactFormGroup" class="space-y-4">
          <ui-text-input label="Name" formControlName="name" theme="light" />
          <ui-text-input label="Email" formControlName="email" theme="light" />
          <ui-text-input label="Phone" formControlName="phone" theme="light" />
          <ui-text-input
            label="Company"
            formControlName="company"
            theme="light"
          />
          <ui-text-input
            label="Status"
            formControlName="status"
            theme="light"
          />
        </form>
      </ng-template>
    </section>
  `,
})
export class CRMContainer implements OnInit {
  /* ---------- ctor / injections ------------------------------------ */
  private fb = inject(FormBuilder);
  private modalUtils = inject(CustomModalService);
  private toggleSvc = inject(SidebarToggleService); // ⬅️  NEW

  /* ---------- quick helper for the button -------------------------- */
  toggleShellSidebar() {
    this.toggleSvc.requestToggle();
  }

  /* ---------- table model & signals -------------------------------- */
  readonly model = signal(new TableModel());
  readonly selectedContact = signal<any | null>(null);

  /* ---------- view refs ------------------------------------------- */
  @ViewChild('contactsContent', { static: true })
  contactsContent!: TemplateRef<any>;
  @ViewChild('addContactForm', { static: true })
  addContactFormTemplate!: TemplateRef<any>;
  @ViewChild('sidebar') sidebar?: ContactSidebarComponent;

  /* ---------- reactive form --------------------------------------- */
  addContactFormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    company: ['', Validators.required],
    status: ['', Validators.required],
  });

  /* ---------- tabs ------------------------------------------------- */
  readonly tabs = computed(() => [
    { label: 'Contacts', content: this.contactsContent },
  ]);

  /* ---------- lifecycle ------------------------------------------- */
  ngOnInit() {
    const tm = new TableModel();
    tm.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Email' }),
      new TableHeaderItem({ data: 'Phone' }),
      new TableHeaderItem({ data: 'Company' }),
      new TableHeaderItem({ data: 'Status' }),
    ];
    tm.data = [
      [
        new TableItem({ data: 'Kristin Watson' }),
        new TableItem({ data: 'kristin.watson@example.com' }),
        new TableItem({ data: '+1 605-555-0123' }),
        new TableItem({ data: 'Acme Inc.' }),
        new TableItem({ data: 'Lead' }),
      ],
      [
        new TableItem({ data: 'Darrell Steward' }),
        new TableItem({ data: 'darrell.steward@example.com' }),
        new TableItem({ data: '+1 605-555-0162' }),
        new TableItem({ data: 'Giobex Corporation' }),
        new TableItem({ data: 'Customer' }),
      ],
    ];
    this.model.set(tm);
  }

  /* ---------- table events ---------------------------------------- */
  handleRowClick(row: TableItem[]) {
    const [name, email, phone, company, status] = row;
    const contact = {
      name: name.data,
      email: email.data,
      phone: phone.data,
      company: company.data,
      status: status.data,
    };
    this.selectedContact.set(contact);
    this.sidebar?.open(contact);
  }

  /* ---------- modal save ------------------------------------------ */
  openAddContactModal() {
    this.addContactFormGroup.reset();
    this.modalUtils.openModal({
      header: 'Add Contact',
      template: this.addContactFormTemplate,
      context: { form: this.addContactFormGroup },
      onSave: () => {
        const v = this.addContactFormGroup.value;
        const newRow = [
          new TableItem({ data: v.name! }),
          new TableItem({ data: v.email! }),
          new TableItem({ data: v.phone! }),
          new TableItem({ data: v.company! }),
          new TableItem({ data: v.status! }),
        ];
        const cur = this.model();
        cur.addRow(newRow);
        this.model.set(cur);
      },
    });
  }

  onSidebarClosed() {
    this.selectedContact.set(null);
  }
}
