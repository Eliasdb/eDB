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
  return useQuery({
    queryKey: enabled ? contactKeys.byId(id!) : contactKeys.byId(''),
    queryFn: () => fetchContact(id!),
    enabled,
  });
}

export function useContactOverview(id?: string) {
  const enabled = !!id;
  return useQuery({
    queryKey: enabled ? contactKeys.overview(id!) : contactKeys.overview(''),
    queryFn: () => fetchContactOverview(id!),
    enabled,
    staleTime: 60_000,
  });
}

export function useContactActivities(id?: string) {
  const enabled = !!id;
  return useQuery({
    queryKey: enabled
      ? contactKeys.activities(id!)
      : contactKeys.activities(''),
    queryFn: () => fetchActivitiesForContact(id!),
    enabled,
    staleTime: 10_000,
  });
}
