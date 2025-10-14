import { EntityItemSkeleton } from './entity-row-skeleton';

export function ContactItemSkeleton() {
  return (
    <EntityItemSkeleton
      avatarShape="circle"
      hasSubtitle={true}
      showDetailsPill={true} // phone pill
    />
  );
}
