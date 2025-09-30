import { DimIcon } from '@ui/primitives';
import { initials } from '@ui/utils';

export function contactToEntityProps(c: {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  source?: string;
}) {
  const chips = [
    c.email && { left: <DimIcon name="mail-outline" />, text: c.email },
    c.phone && { left: <DimIcon name="call-outline" />, text: c.phone },
    c.source && {
      left: <DimIcon name="sparkles-outline" />,
      text: `Added by Clara • ${c.source}`,
    },
  ].filter(Boolean) as NonNullable<any>;

  return {
    name: c.name,
    avatarUrl: c.avatarUrl,
    initials: initials(c.name),
    avatarShape: 'circle' as const,
    chips,
  };
}

export function companyToEntityProps(co: {
  id: string;
  name: string;
  industry?: string;
  domain?: string;
  logoUrl?: string;
  source?: string;
}) {
  const chips = [
    co.industry && {
      left: <DimIcon name="briefcase-outline" />,
      text: co.industry,
    },
    co.domain && { left: <DimIcon name="globe-outline" />, text: co.domain },
    co.source && {
      left: <DimIcon name="sparkles-outline" />,
      text: `Added by Clara • ${co.source}`,
    },
  ].filter(Boolean) as NonNullable<any>;

  return {
    name: co.name,
    avatarUrl: co.logoUrl,
    initials: initials(co.name),
    avatarShape: 'rounded' as const,
    chips,
  };
}
