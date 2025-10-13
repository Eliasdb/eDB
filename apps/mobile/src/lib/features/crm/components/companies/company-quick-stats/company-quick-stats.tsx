// features/crm/components/companies/company-quick-stats/company-quick-stats.tsx
import { KeyValueRow } from '@ui/composites';
import { List } from '@ui/primitives';

import type { CompanyOverview } from '@data-access/crm/companies/types';
import { companyStatsConfig, type StatRow } from './company-quick-stats.config';

export function CompanyQuickStats({
  data,
  loading = false,
  config = companyStatsConfig,
}: {
  data?: CompanyOverview;
  loading?: boolean;
  /** allow per-screen override */
  config?: readonly StatRow[];
}) {
  return (
    <List>
      {config.map((row, idx) => {
        const val = loading ? null : row.getValue(data);
        return (
          <List.Item key={row.label} first={idx === 0}>
            <KeyValueRow
              icon={row.icon}
              label={row.label}
              value={val ?? row.empty ?? '—'}
            />
          </List.Item>
        );
      })}
    </List>
  );
}

export default CompanyQuickStats;
