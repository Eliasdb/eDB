import type { CompanyOverview } from '@edb-clara/client-crm';
import { FieldRow, LinkFieldRow, List } from '@edb/shared-ui-rn';
import type { DetailRow } from './company-snapshot-collection/company-snapshot-collection.config';

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
        const href = loading ? undefined : row.getHref?.(data);
        return (
          <List.Item key={row.label} first={idx === 0}>
            {href ? (
              <LinkFieldRow
                icon={row.icon}
                label={row.label}
                value={value ?? row.empty ?? undefined}
                href={href}
              />
            ) : (
              <FieldRow
                icon={row.icon}
                label={row.label}
                value={value ?? row.empty ?? undefined}
              />
            )}
          </List.Item>
        );
      })}
    </List>
  );
}
