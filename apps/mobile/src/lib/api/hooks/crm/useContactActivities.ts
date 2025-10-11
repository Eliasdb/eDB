import { useQuery } from '@tanstack/react-query';
import { activityKeys } from '../../core/keys';
import { fetchActivitiesForContact } from '../../services';

export function useContactActivities(contactId?: string) {
  return useQuery({
    queryKey: contactId
      ? activityKeys.byContact(contactId)
      : activityKeys.byContact(''),
    queryFn: () => fetchActivitiesForContact(contactId!),
    enabled: !!contactId,
    staleTime: 10_000,
  });
}
