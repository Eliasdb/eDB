import { EntityItemSkeleton } from './entity-row-skeleton';

export function CompanyItemSkeleton() {
  return (
    <EntityItemSkeleton
      avatarShape="rounded"
      hasSubtitle={true} // e.g., industry list
      showDetailsPill={true} // domain pill
    />
  );
}
