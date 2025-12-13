import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { environment } from '@eDB/shared-env';
import { CompanyDto, ContactDto } from './types';

/* ─────────────────────────────────────────── */
/* DTOs & payload helpers                      */
/* ─────────────────────────────────────────── */

/* creation / update helpers */
export type NewCompanyPayload = Omit<CompanyDto, 'id'>;
export type NewContactPayload = Omit<
  ContactDto,
  'id' | 'companyName' | 'createdAt' | 'updatedAt'
>;
export type UpdateCompanyPayload = Partial<NewCompanyPayload> & { id: string };
export type UpdateContactPayload = Partial<NewContactPayload> & { id: string };

@Injectable({ providedIn: 'root' })
export class CrmService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  private readonly base = `${environment.apiBaseUrl}/crm`;

  /* ─────────────── Queries ─────────────── */

  /* Companies */
  private readonly companiesQ = injectQuery<CompanyDto[]>(() => ({
    queryKey: ['crm', 'companies'],
    queryFn: () =>
      firstValueFrom(this.http.get<CompanyDto[]>(`${this.base}/companies`)),
    refetchOnWindowFocus: false,
  }));
  readonly companies = computed(() => this.companiesQ.data?.() ?? []);

  companyByIdQuery(id: string) {
    return injectQuery<CompanyDto>(() => ({
      queryKey: ['crm', 'companies', id],
      queryFn: () =>
        firstValueFrom(
          this.http.get<CompanyDto>(`${this.base}/companies/${id}`),
        ),
      enabled: !!id,
    }));
  }

  /* Contacts */
  private readonly contactsQ = injectQuery<ContactDto[]>(() => ({
    queryKey: ['crm', 'contacts'],
    queryFn: () =>
      firstValueFrom(this.http.get<ContactDto[]>(`${this.base}/contacts`)),
    refetchOnWindowFocus: false,
  }));
  readonly contacts = computed(() => this.contactsQ.data?.() ?? []);

  contactByIdQuery(id: string) {
    return injectQuery<ContactDto>(() => ({
      queryKey: ['crm', 'contacts', id],
      queryFn: () =>
        firstValueFrom(
          this.http.get<ContactDto>(`${this.base}/contacts/${id}`),
        ),
      enabled: !!id,
    }));
  }

  /* ──────────── Invalidators ──────────── */
  private invalidateCompanies() {
    this.queryClient.invalidateQueries({ queryKey: ['crm', 'companies'] });
  }
  private invalidateContacts() {
    this.queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
  }

  /* ──────────── Mutations ──────────── */

  /* Companies */
  addCompanyMutation() {
    return injectMutation(() => ({
      mutationFn: (payload: NewCompanyPayload) =>
        firstValueFrom(
          this.http.post<CompanyDto>(`${this.base}/companies`, payload),
        ),
      onSuccess: () => this.invalidateCompanies(),
    }));
  }
  updateCompanyMutation() {
    return injectMutation(() => ({
      mutationFn: (p: UpdateCompanyPayload) =>
        firstValueFrom(
          this.http.put<void>(`${this.base}/companies/${p.id}`, p),
        ),
      onSuccess: () => this.invalidateCompanies(),
    }));
  }
  deleteCompanyMutation() {
    return injectMutation(() => ({
      mutationFn: (id: string) =>
        firstValueFrom(this.http.delete<void>(`${this.base}/companies/${id}`)),
      onSuccess: () => this.invalidateCompanies(),
    }));
  }

  /* Contacts */
  addContactMutation() {
    return injectMutation(() => ({
      mutationFn: (payload: NewContactPayload) =>
        firstValueFrom(
          this.http.post<ContactDto>(`${this.base}/contacts`, payload),
        ),
      onSuccess: () => this.invalidateContacts(),
    }));
  }
  updateContactMutation() {
    return injectMutation(() => ({
      mutationFn: (p: UpdateContactPayload) =>
        firstValueFrom(this.http.put<void>(`${this.base}/contacts/${p.id}`, p)),
      onSuccess: () => this.invalidateContacts(),
    }));
  }
  deleteContactMutation() {
    return injectMutation(() => ({
      mutationFn: (id: string) =>
        firstValueFrom(this.http.delete<void>(`${this.base}/contacts/${id}`)),
      onSuccess: () => this.invalidateContacts(),
    }));
  }
}
