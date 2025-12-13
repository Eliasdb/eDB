// data-access/crm/contacts/queries.ts
import { useQuery } from '@tanstack/react-query';
import { contactKeys } from './keys';
import {
  fetchActivitiesForContact,
  fetchContact,
  fetchContactOverview,
  fetchContacts,
} from './service';

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.list(),
    queryFn: fetchContacts,
    staleTime: 15_000,
  });
}

export function useContact(id?: string) {
  const enabled = !!id;
  const contactId = id ?? '';
  return useQuery({
    queryKey: contactKeys.byId(contactId),
    queryFn: () => fetchContact(contactId),
    enabled,
  });
}

export function useContactOverview(id?: string) {
  const enabled = !!id;
  const contactId = id ?? '';
  return useQuery({
    queryKey: contactKeys.overview(contactId),
    queryFn: () => fetchContactOverview(contactId),
    enabled,
    staleTime: 60_000,
  });
}

export function useContactActivities(id?: string) {
  const enabled = !!id;
  const contactId = id ?? '';
  return useQuery({
    queryKey: contactKeys.activities(contactId),
    queryFn: () => fetchActivitiesForContact(contactId),
    enabled,
    staleTime: 10_000,
  });
}
