// features/crm/config/company-details.config.ts
import type {
  Company,
  CompanyHQ,
  CompanyOverview,
} from '@edb-clara/client-crm';

type IconName = React.ComponentProps<
  typeof import('@expo/vector-icons').Ionicons
>['name'];

export type DetailRow = {
  icon: IconName;
  label: string;
  getValue: (ov?: CompanyOverview) => string | number | null | undefined;
  getHref?: (ov?: CompanyOverview) => string | null | undefined;
  empty?: string;
};

export const companyDetailsConfig: readonly DetailRow[] = [
  {
    icon: 'business-outline',
    label: 'HQ',
    getValue: (ov) => {
      const hq: CompanyHQ | null | undefined = (ov?.company as Company | null)
        ?.hq;
      if (!hq) return undefined;
      const parts = [
        hq.line1,
        hq.line2,
        hq.postalCode,
        hq.city,
        hq.region,
        hq.country,
      ]
        .filter(Boolean)
        .map(String);
      return parts.length ? parts.join(', ') : undefined;
    },
  },
  {
    icon: 'people-outline',
    label: 'Employees',
    getValue: (ov) =>
      ov?.company.employees ?? ov?.company.employeesRange ?? null,
  },
  {
    icon: 'person-circle-outline',
    label: 'Owner',
    getValue: (ov) => ov?.company.ownerContactId ?? null,
  },
  {
    icon: 'call-outline',
    label: 'Contacts',
    getValue: (ov) =>
      ov?.stats.contactsCount != null ? ov.stats.contactsCount : null,
  },
  {
    icon: 'link-outline',
    label: 'Website',
    getValue: (ov) => {
      const w = ov?.company?.website;
      if (!w) return null;
      try {
        return new URL(w).hostname;
      } catch {
        return w; // show raw if not a full URL
      }
    },
    getHref: (ov) => ov?.company?.website ?? undefined,
  },
  {
    icon: 'mail-outline',
    label: 'Primary email',
    getValue: (ov) => ov?.company.primaryEmail ?? null,
    getHref: (ov) =>
      ov?.company.primaryEmail
        ? `mailto:${ov.company.primaryEmail}`
        : undefined,
  },
  {
    icon: 'call-outline',
    label: 'Phone',
    getValue: (ov) => ov?.company.phone ?? null,
    getHref: (ov) =>
      ov?.company.phone ? `tel:${ov.company.phone}` : undefined,
  },
] as const;
