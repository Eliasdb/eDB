/* ------------------------------------------------------------------ */
/* crm-contacts-page.component.ts – Companies & Contacts dashboard    */
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
  UiButtonComponent,
  UiIconButtonComponent,
  UiTableComponent,
  UiTextInputComponent,
} from '@edb/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import {
  CompanyCard /* ←— correct path */,
  CrmCompanySidebarComponent,
} from './components/crm-company-sidebar.component';
import { ContactSidebarComponent } from './components/side-bar.components';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactStatus } from './types/contact.types';

@Component({
  selector: 'crm-contacts-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    /* shared-ui */
    UiTableComponent,
    UiTextInputComponent,
    UiButtonComponent,
    UiIconButtonComponent,

    /* sidebars */
    ContactSidebarComponent,
    CrmCompanySidebarComponent,

    /* material */
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <section class="max-w-7xl mx-auto px-6 pb-14">
      <!-- ░ Page title ░ -->
      <h1 class="mb-10 text-2xl font-bold tracking-tight text-black">
        Companies&nbsp;&amp;&nbsp;Contacts
      </h1>

      <h2>test</h2>
      <form [formGroup]="addContactFormGroup" class="space-y-4">
        <ui-text-input label="Name" formControlName="name" theme="light" />
        <ui-text-input label="Email" formControlName="email" theme="light" />
        <ui-text-input label="Phone" formControlName="phone" theme="light" />
        <ui-text-input
          label="Company"
          formControlName="company"
          theme="light"
        />
        <ui-text-input label="Status" formControlName="status" theme="light" />
      </form>
      <!-- ░░ Companies ░░ -->
      <header
        class="mb-6 flex flex-col gap-4
               sm:flex-row sm:items-end sm:justify-between text-black"
      >
        <div>
          <h2 class="text-xl font-semibold">Companies</h2>
          <p class="text-gray-500 text-sm">Snapshot of your accounts</p>
        </div>

        <ui-button
          variant="ghost"
          size="sm"
          icon="faPlus"
          (buttonClick)="openAddCompanyModal()"
        >
          New&nbsp;Company
        </ui-button>
      </header>

      <div
        class="mb-8 grid gap-6"
        [ngClass]="{
          'grid-cols-1': true,
          'sm:grid-cols-2': companies().length > 1,
          'lg:grid-cols-3': companies().length > 2,
        }"
        *ngIf="companies().length; else noCompanies"
      >
        <button
          *ngFor="let c of companies()"
          class="group relative rounded-lg border p-5 text-left transition
                 hover:shadow focus:outline-none focus:ring-2
                 focus:ring-offset-2 focus:ring-blue-500"
          [ngClass]="{
            'border-blue-600 bg-blue-50 shadow-sm':
              selectedCompany() === c.name,
          }"
          (click)="filterByCompany(c.name)"
        >
          <h3 class="font-medium text-gray-900 group-hover:text-gray-700">
            {{ c.name }}
          </h3>
          <p class="mt-1 text-xs text-gray-500">
            {{ c.contactCount }} contact<span *ngIf="c.contactCount !== 1"
              >s</span
            >
          </p>

          <!-- opens the company sidebar -->
          <ui-icon-button
            icon="faPen"
            kind="ghost"
            size="sm"
            description="Edit company"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            (iconButtonClick)="openCompanySidebar(c); $event.stopPropagation()"
          />
        </button>
      </div>

      <!-- clear-filter chip -->
      <div class="mb-10" *ngIf="selectedCompany()">
        <ui-button
          variant="ghost"
          size="sm"
          icon="faTimes"
          (buttonClick)="clearCompanyFilter()"
        >
          Showing&nbsp;“{{ selectedCompany() }}” – Clear
        </ui-button>
      </div>

      <ng-template #noCompanies>
        <p class="mb-10 text-sm text-gray-500">
          No companies yet – add one to get started.
        </p>
      </ng-template>

      <!-- ░░ Contacts ░░ -->
      <header class="mb-4 flex items-center justify-between text-black">
        <div>
          <h2 class="text-xl font-semibold">Contacts</h2>
          <p class="text-gray-500 text-sm">All business contacts</p>
        </div>

        <ui-button
          variant="primary"
          size="sm"
          icon="faPlus"
          (buttonClick)="openAddContactModal()"
        >
          New&nbsp;Contact
        </ui-button>
      </header>

      <ui-table
        [model]="displayedModel()"
        [showToolbar]="true"
        [showButton]="false"
        [showHeader]="false"
        searchPlaceholder="Search contacts…"
        tableSize="sm"
        (rowClicked)="handleRowClick($event)"
      >
      </ui-table>

      <!-- ░░ Sidebars ░░ -->
      <crm-contact-sidebar #contactSidebar (closed)="onContactSidebarClosed()">
      </crm-contact-sidebar>

      <crm-company-sidebar #companySidebar (closed)="onCompanySidebarClosed()">
      </crm-company-sidebar>

      <!-- ░░ Modals ░░ -->
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

      <ng-template #addCompanyForm>
        <form [formGroup]="addCompanyFormGroup" class="space-y-4">
          <ui-text-input
            label="Company name"
            formControlName="company"
            theme="light"
          />
        </form>
      </ng-template>
    </section>
  `,
})
export class CRMContainer implements OnInit {
  /* ────────── DI ────────── */
  private fb = inject(FormBuilder);
  private mod = inject(CustomModalService);

  /* ────────── state ─────── */
  private readonly allModel = signal(new TableModel());
  readonly displayedModel = signal(new TableModel());
  readonly selectedCompany = signal<string | null>(null);
  private readonly extraCompanies = signal<Set<string>>(new Set());

  /* card list */
  readonly companies = computed(() => {
    const map = new Map<string, number>();

    this.allModel().data.forEach((row) => {
      const n = (row[3]?.data as string)?.trim();
      if (n) map.set(n, (map.get(n) ?? 0) + 1);
    });

    this.extraCompanies().forEach((n) => {
      if (!map.has(n)) map.set(n, 0);
    });

    return Array.from(map, ([name, contactCount]) => ({ name, contactCount }));
  });

  /* ─── view refs ─── */
  @ViewChild('addContactForm', { static: true })
  addContactTpl!: TemplateRef<any>;
  @ViewChild('addCompanyForm', { static: true })
  addCompanyTpl!: TemplateRef<any>;

  @ViewChild('contactSidebar') contactSidebar?: ContactSidebarComponent;
  @ViewChild('companySidebar') companySidebar?: CrmCompanySidebarComponent;

  /* ─── forms ─── */
  addContactFormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    company: ['', Validators.required],
    status: ['', Validators.required],
  });

  addCompanyFormGroup = this.fb.group({
    company: ['', Validators.required],
  });

  /* ─── init ─── */
  ngOnInit(): void {
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
    this.allModel.set(tm);
    this.displayedModel.set(tm);
  }

  /* ─── filtering ─── */
  filterByCompany(name: string): void {
    this.selectedCompany.set(name);

    const fm = new TableModel();
    fm.header = this.allModel().header;
    fm.data = this.allModel().data.filter(
      (r) => (r[3]?.data as string)?.trim() === name,
    );

    this.displayedModel.set(fm);
  }
  clearCompanyFilter(): void {
    this.selectedCompany.set(null);
    this.displayedModel.set(this.allModel());
  }

  /* ─── contacts ─── */
  handleRowClick(row: TableItem[]): void {
    /** 1️⃣ extract the cell objects */
    const [nameCell, emailCell, phoneCell, companyCell, statusCell] = row;

    /** 2️⃣ pass their `.data` *string* to the sidebar */
    this.contactSidebar?.open({
      name: nameCell.data as string,
      email: emailCell.data as string,
      phone: phoneCell.data as string,
      company: companyCell.data as string,
      status: statusCell.data as ContactStatus, // 👈 cast
    });
  }

  openAddContactModal(): void {
    this.addContactFormGroup.reset();
    this.mod.openModal({
      header: 'New Contact',
      template: this.addContactTpl,
      context: { form: this.addContactFormGroup },
      onSave: () => {
        const v = this.addContactFormGroup.value;

        /** 3️⃣ add the new row (same as before) */
        const row = [
          new TableItem({ data: v.name! }),
          new TableItem({ data: v.email! }),
          new TableItem({ data: v.phone! }),
          new TableItem({ data: v.company! }),
          new TableItem({ data: v.status! }),
        ];
        const all = this.allModel();
        all.addRow(row);
        this.allModel.set(all);

        /** 4️⃣ immediately open the sidebar with plain strings */
        this.contactSidebar?.open({
          name: v.name!,
          email: v.email!,
          phone: v.phone!,
          company: v.company!,
          status: v.status! as ContactStatus,
        });

        this.clearCompanyFilter(); // keep the new row visible
      },
    });
  }

  onContactSidebarClosed(): void {
    /* nothing yet */
  }

  /* ─── companies ─── */
  openCompanySidebar(c: CompanyCard): void {
    /* ensure optional fields are always defined to satisfy the CompanyCard type */
    this.companySidebar?.open({
      ...c,
      address: c.address ?? '',
      website: c.website ?? '',
      tags: c.tags ?? [],
    });
  }

  openAddCompanyModal(): void {
    this.addCompanyFormGroup.reset();
    this.mod.openModal({
      header: 'New Company',
      template: this.addCompanyTpl,
      context: { form: this.addCompanyFormGroup },
      onSave: () => {
        const name = this.addCompanyFormGroup.value.company?.trim();
        if (!name) return;
        const set = new Set(this.extraCompanies());
        set.add(name);
        this.extraCompanies.set(set);
      },
    });
  }

  onCompanySidebarClosed(): void {
    /* nothing yet */
  }
}
