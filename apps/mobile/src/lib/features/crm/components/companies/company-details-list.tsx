import type { CompanyOverview } from '@data-access/crm/companies/types';
import { FieldRow, LinkFieldRow } from '@ui/composites';
import { List } from '@ui/primitives';
import type { DetailRow } from '../../config/company-details.config';

export function CompanyDetailsList({
  data,
  loading = false,
  config,
}: {
  data?: CompanyOverview;
  loading?: boolean;
  config: readonly DetailRow[];
}) {
  return (
    <List>
      {config.map((row, idx) => {
        const value = loading ? null : row.getValue(data);
        const href = loading ? undefined : (row.getHref?.(data) ?? undefined);
        const Row = href ? LinkFieldRow : FieldRow;
        return (
          <List.Item key={row.label} first={idx === 0}>
            {/* LinkFieldRow accepts href; FieldRow ignores it */}
            <Row
              icon={row.icon}
              label={row.label}
              value={value ?? row.empty ?? undefined}
              href={href as any}
            />
          </List.Item>
        );
      })}
    </List>
  );
}
