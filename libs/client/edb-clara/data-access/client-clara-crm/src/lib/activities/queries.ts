// data-access/crm/activities/queries.ts
import { useQuery } from '@tanstack/react-query';
import { activityKeys } from './keys';
import { fetchActivities } from './service';

export function useActivities() {
  return useQuery({
    queryKey: activityKeys.list(),
    queryFn: fetchActivities,
    staleTime: 10_000,
  });
}

// export function useActivitiesByContact(contactId?: string) {
//   const enabled = !!contactId;
//   return useQuery({
//     queryKey: enabled
//       ? activityKeys.byContact(contactId!)
//       : activityKeys.byContact(''),
//     queryFn: () => fetchActivitiesForContact(contactId!),
//     enabled,
//     staleTime: 10_000,
//   });
// }
