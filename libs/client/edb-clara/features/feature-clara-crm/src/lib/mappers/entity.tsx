// apps/mobile/src/features/crm/mappers/entity.ts
import { Company } from '@edb-clara/client-crm';
import type { EntityMetaItem, EntityTag } from '@edb/shared-ui-rn';
import { initials as toInitials } from '@edb/shared-ui-rn';

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

// features/crm/mappers/entity.ts
// features/crm/mappers/entity.ts

function domainFromWebsite(website?: string | null) {
  if (!website) return undefined;
  try {
    return new URL(website).hostname;
  } catch {
    return website.replace(/^https?:\/\//i, '');
  }
}

function toneForStage(stage?: Company['stage']): EntityTag['tone'] {
  if (!stage) return undefined;
  switch (stage) {
    case 'customer':
      return 'success';
    case 'inactive':
      return 'neutral';
    case 'lead':
    case 'prospect':
      return 'info'; // <- use "info" instead of "secondary"
    default:
      return 'info';
  }
}

export function companyToEntityRowProps(co: Company) {
  const tags: EntityTag[] = [];
  if (co.source) {
    tags.push({
      text: `Added by Clara • ${co.source}`,
      tone: 'primary',
      leftIcon: 'sparkles-outline',
    });
  }
  if (co.stage) {
    tags.push({
      text: co.stage,
      tone: toneForStage(co.stage),
      leftIcon: 'flag-outline',
    });
  }

  const meta: EntityMetaItem[] = [];
  const domain = co.domain ?? domainFromWebsite(co.website);
  if (domain) {
    meta.push({
      label: 'Domain',
      value: domain,
      icon: 'globe-outline',
      pill: true,
    });
  }

  return {
    title: co.name,
    subtitle: co.industry ?? undefined,
    avatarUrl: co.logoUrl,
    initials: toInitials(co.name),
    avatarShape: 'rounded' as const,
    tags,
    meta,
  };
}
