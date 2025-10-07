// apps/mobile/src/features/crm/mappers/entity.ts
import type { EntityMetaItem, EntityTag } from '@ui/composites';
import { initials as toInitials } from '@ui/utils';

export function contactToEntityRowProps(c: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  source?: string;
}) {
  const tags: EntityTag[] = [];
  if (c.source) {
    tags.push({
      text: `Added by Clara • ${c.source}`,
      tone: 'primary',
      leftIcon: 'sparkles-outline',
    });
  }

  const meta: EntityMetaItem[] = [];
  // ⛔ do NOT push email to meta; it goes as subtitle
  if (c.phone)
    meta.push({
      label: 'Phone',
      value: c.phone,
      icon: 'call-outline',
      pill: true,
    });

  return {
    title: c.name,
    subtitle: c.email, // shown under name in the header
    avatarUrl: c.avatarUrl,
    initials: toInitials(c.name),
    avatarShape: 'circle' as const,
    tags,
    meta,
  };
}

export function companyToEntityRowProps(co: {
  id: string;
  name: string;
  industry?: string;
  domain?: string;
  logoUrl?: string;
  source?: string;
}) {
  const tags: EntityTag[] = [];
  if (co.source) {
    tags.push({
      text: `Added by Clara • ${co.source}`,
      tone: 'primary',
      leftIcon: 'sparkles-outline',
    });
  }

  const meta: EntityMetaItem[] = [];
  if (co.domain)
    meta.push({
      label: 'Domain',
      value: co.domain,
      icon: 'globe-outline',
      pill: true,
    });

  return {
    title: co.name,
    subtitle: co.industry,
    avatarUrl: co.logoUrl,
    initials: toInitials(co.name),
    avatarShape: 'rounded' as const,
    tags,
    meta,
  };
}
