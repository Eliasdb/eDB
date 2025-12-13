/* ------------------------------------------------------------------ */
/* crm-contacts-page.component.ts – Companies & Contacts dashboard    */
/* ------------------------------------------------------------------ */
import { NgClass } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

/* sidebars */
import {
  CompanyCard,
  CrmCompanySidebarComponent,
} from './components/sidebar/crm-company-sidebar.component';
import { ContactSidebarComponent } from './components/sidebar/side-bar.components';

/* DTOs & service */
import {
  CrmService,
  NewCompanyPayload,
  NewContactPayload,
} from '@edb/client-crm';
import { ContactStatus } from './types/contact.types';

@Component({
  selector: 'crm-contacts-page',
  standalone: true,
  imports: [
    /* Angular */
    ReactiveFormsModule,
    NgClass,
    /* Shared UI */
    UiTableComponent,
    UiTextInputComponent,
    UiButtonComponent,
    UiIconButtonComponent,
    /* Feature */
    ContactSidebarComponent,
    CrmCompanySidebarComponent,
    /* Material */
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <section class="bg-slate-50 px-6 pb-28 pt-8 min-h-[calc(100dvh-9rem)]">
      <section class="max-w-7xl mx-auto">
        <!-- ░ Page title ░ -->
        <h1 class="mb-10 text-2xl font-bold tracking-tight text-black">
          Companies&nbsp;&amp;&nbsp;Contacts
        </h1>

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

        @if (companies().length > 0) {
          <div
            class="mb-8 grid gap-6"
            [ngClass]="{
              'grid-cols-1': true,
              'sm:grid-cols-2': companies().length > 1,
              'lg:grid-cols-3': companies().length > 2,
            }"
          >
            @for (c of companies(); track c.name) {
              <button
                class="group relative rounded-lg border p-5 text-left transition
               hover:shadow focus:outline-none focus:ring-2
               focus:ring-offset-2 focus:ring-blue-500 bg-white"
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
                  {{ c.contactCount }} contact
                  @if (c.contactCount !== 1) {
                    <span>s</span>
                  }
                </p>

                <ui-icon-button
                  icon="faPen"
                  kind="ghost"
                  size="sm"
                  description="Edit company"
                  class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                  (iconButtonClick)="
                    openCompanySidebar(c); $event.stopPropagation()
                  "
                />
              </button>
            }
          </div>
        } @else {
          <p class="mb-10 text-sm text-gray-500">
            No companies yet – add one to get started.
          </p>
        }

        @if (selectedCompany()) {
          <div class="mb-10">
            <ui-button
              variant="ghost"
              size="sm"
              icon="faTimes"
              (buttonClick)="clearCompanyFilter()"
            >
              Showing&nbsp;“{{ selectedCompany() }}” – Clear
            </ui-button>
          </div>
        }

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
        <crm-contact-sidebar
          #contactSidebar
        >
        </crm-contact-sidebar>

        <crm-company-sidebar
          #companySidebar
        >
        </crm-company-sidebar>

        <!-- ░░ Modals ░░ -->
        <ng-template #addContactForm>
          <form [formGroup]="addContactFormGroup" class="space-y-4">
            <ui-text-input
              label="First name"
              formControlName="firstName"
              theme="light"
            />
            <ui-text-input
              label="Last name"
              formControlName="lastName"
              theme="light"
            />
            <ui-text-input
              label="Email"
              formControlName="email"
              theme="light"
            />
            <ui-text-input
              label="Phone"
              formControlName="phone"
              theme="light"
            />
            <ui-text-input
              label="Company ID"
              formControlName="companyId"
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
              formControlName="name"
              theme="light"
            />
            <ui-text-input
              label="VAT number"
              formControlName="vatNumber"
              theme="light"
            />
            <ui-text-input
              label="Website"
              formControlName="website"
              theme="light"
            />
          </form>
        </ng-template>
      </section>
    </section>
  `,
})
export class CRMContainer {
  /* ────────── DI ────────── */
  private fb = inject(FormBuilder);
  private mod = inject(CustomModalService);
  private crm = inject(CrmService);

  /* ────────── Signals ────────── */
  readonly selectedCompany = signal<string | null>(null);
  private readonly extraCompanies = signal<Set<string>>(new Set());

  /* API data */
  readonly contacts = this.crm.contacts;
  readonly companies = computed(() => {
    const map = new Map<string, number>();

    this.contacts().forEach((c) => {
      const name = c.companyName.trim();
      map.set(name, (map.get(name) ?? 0) + 1);
    });

    this.extraCompanies().forEach((n) => map.set(n, map.get(n) ?? 0));

    return Array.from(map, ([name, contactCount]) => ({ name, contactCount }));
  });

  /* ────────── Table model derived from signals ────────── */
  readonly displayedModel = computed<TableModel>(() => {
    const selected = this.selectedCompany();
    const rows = this.contacts()
      .filter((c) => !selected || c.companyName === selected)
      .map((c) => [
        new TableItem({ data: `${c.firstName} ${c.lastName}` }),
        new TableItem({ data: c.email }),
        new TableItem({ data: c.phone }),
        new TableItem({ data: c.companyName }),
        new TableItem({ data: c.status }),
      ]);

    const tm = new TableModel();
    tm.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Email' }),
      new TableHeaderItem({ data: 'Phone' }),
      new TableHeaderItem({ data: 'Company' }),
      new TableHeaderItem({ data: 'Status' }),
    ];
    tm.data = rows;
    return tm;
  });
  /* ───── view refs ───── */
  @ViewChild('addContactForm', { static: true })
  private addContactTpl!: TemplateRef<unknown>;
  @ViewChild('addCompanyForm', { static: true })
  private addCompanyTpl!: TemplateRef<unknown>;
  @ViewChild('contactSidebar') private contactSidebar?: ContactSidebarComponent;
  @ViewChild('companySidebar')
  private companySidebar?: CrmCompanySidebarComponent;

  /* ───── forms ───── */
  addContactFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phone: [''],
    companyId: ['', Validators.required],
    status: ['Lead' as ContactStatus],
  });

  addCompanyFormGroup = this.fb.group({
    name: ['', Validators.required],
    vatNumber: [''],
    website: [''],
  });

  /* ───── filtering ───── */
  filterByCompany(name: string) {
    this.selectedCompany.set(name);
  }
  clearCompanyFilter() {
    this.selectedCompany.set(null);
  }

  /* ───── contacts ───── */
  handleRowClick(row: TableItem[]) {
    const [name, email, phone, company, status] = row;
    const [firstName, ...lastName] = (name.data as string).split(' ');

    this.contactSidebar?.open({
      firstName,
      lastName: lastName.join(' '),
      email: email.data as string,
      phone: phone.data as string,
      companyName: company.data as string,
      status: status.data as ContactStatus,
    });
  }

  openAddContactModal() {
    this.addContactFormGroup.reset({ status: 'Lead' });
    this.mod.openModal({
      header: 'New Contact',
      template: this.addContactTpl,
      context: { form: this.addContactFormGroup },
      onSave: () => {
        if (this.addContactFormGroup.invalid) return;

        const v = this.addContactFormGroup.getRawValue();
        const { firstName, lastName, email, phone, companyId, status } = v;
        if (!firstName || !lastName || !email || !companyId || !status) return;
        const payload: NewContactPayload = {
          firstName,
          lastName,
          email,
          phone: phone ?? '',
          companyId,
          status: status as ContactStatus,
        };
        this.crm.addContactMutation().mutate(payload);
      },
    });
  }

  /* ───── companies ───── */
  openCompanySidebar(c: CompanyCard) {
    this.companySidebar?.open({ ...c, address: '', website: '', tags: [] });
  }

  openAddCompanyModal() {
    this.addCompanyFormGroup.reset();
    this.mod.openModal({
      header: 'New Company',
      template: this.addCompanyTpl,
      context: { form: this.addCompanyFormGroup },
      onSave: () => {
        if (this.addCompanyFormGroup.invalid) return;

        const v = this.addCompanyFormGroup.getRawValue();
        const { name, vatNumber, website } = v;
        if (!name) return;
        const payload: NewCompanyPayload = {
          name,
          vatNumber: vatNumber ?? '',
          website: website ?? '',
        };
        this.crm.addCompanyMutation().mutate(payload);

        /* Add to local set so it appears immediately */
        const set = new Set(this.extraCompanies());
        set.add(payload['name'].trim());
        this.extraCompanies.set(set);
      },
    });
  }

  /* ───── sidebar close hooks (reserved) ───── */
}
